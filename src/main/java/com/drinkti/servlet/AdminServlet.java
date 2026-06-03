package com.drinkti.servlet;

import com.drinkti.dao.CocktailDao;
import com.drinkti.dao.TestResultDao;
import com.drinkti.dao.UserDao;
import com.drinkti.dao.CocktailTemplateDao;
import com.drinkti.model.TestResult;
import com.drinkti.model.Cocktail;
import com.drinkti.model.User;
import com.drinkti.util.DbUtil;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@WebServlet("/api/admin/*")
public class AdminServlet extends BaseServlet {
    private final UserDao userDao = new UserDao();
    private final TestResultDao resultDao = new TestResultDao();
    private final CocktailDao cocktailDao = new CocktailDao();
    private final CocktailTemplateDao templateDao = new CocktailTemplateDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");

        HttpSession session = req.getSession(false);
        String role = (session != null) ? (String) session.getAttribute("role") : null;
        if (!"admin".equals(role)) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write("{\"message\":\"无管理员权限\"}");
            return;
        }

        String pathInfo = req.getPathInfo();
        if ("/stats".equals(pathInfo)) {
            handleStats(resp);
        } else if ("/detail".equals(pathInfo)) {
            handleDetail(resp);
        } else if ("/health".equals(pathInfo)) {
            resp.getWriter().write("{\"status\":\"ok\",\"admin\":true}");
        } else {
            resp.getWriter().write("{\"status\":\"ok\",\"admin\":true}");
        }
    }

    private void handleStats(HttpServletResponse resp) throws IOException {
        try {
            int userCount = userDao.countAll();
            int resultCount = resultDao.findAll().size();
            int cocktailCount = cocktailDao.countAll();
            int templateCount = templateDao.countAll();

            Map<String, Object> stats = new HashMap<>();
            stats.put("userCount", userCount);
            stats.put("resultCount", resultCount);
            stats.put("cocktailCount", cocktailCount);
            stats.put("templateCount", templateCount);
            resp.getWriter().write(GSON.toJson(stats));
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\":\"查询失败\"}");
        }
    }

    /**
     * 返回详细数据：用户列表（含测试次数）、MBTI分布、最近测试记录、最近特调记录
     */
    private void handleDetail(HttpServletResponse resp) throws IOException {
        try {
            List<Map<String, Object>> users = queryUsersWithStats();
            List<Map<String, Object>> mbtiDist = queryMbtiDistribution();
            List<Map<String, Object>> recentResults = queryRecentResults();
            List<Map<String, Object>> recentCocktails = queryRecentCocktails();

            Map<String, Object> data = new HashMap<>();
            data.put("users", users);
            data.put("mbtiDist", mbtiDist);
            data.put("recentResults", recentResults);
            data.put("recentCocktails", recentCocktails);
            resp.getWriter().write(GSON.toJson(data));
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\":\"查询失败:" + e.getMessage() + "\"}");
        }
    }

    private List<Map<String, Object>> queryUsersWithStats() throws SQLException {
        String sql = "SELECT u.id, u.username, u.nickname, u.avatar, u.role, u.created_at, " +
                     "COUNT(t.id) AS test_count, " +
                     "(SELECT mbti FROM test_results WHERE user_id = u.id ORDER BY result_timestamp DESC LIMIT 1) AS latest_mbti " +
                     "FROM users u LEFT JOIN test_results t ON u.id = t.user_id " +
                     "GROUP BY u.id ORDER BY u.created_at DESC";
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> user = new LinkedHashMap<>();
                user.put("id", rs.getLong("id"));
                user.put("username", rs.getString("username"));
                user.put("nickname", rs.getString("nickname"));
                user.put("avatar", rs.getString("avatar"));
                user.put("role", rs.getString("role"));
                user.put("createdAt", rs.getString("created_at"));
                user.put("testCount", rs.getInt("test_count"));
                user.put("latestMbti", rs.getString("latest_mbti"));
                list.add(user);
            }
        }
        return list;
    }

    private List<Map<String, Object>> queryMbtiDistribution() throws SQLException {
        String sql = "SELECT mbti, COUNT(*) AS cnt FROM test_results GROUP BY mbti ORDER BY cnt DESC";
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("mbti", rs.getString("mbti"));
                item.put("count", rs.getInt("cnt"));
                list.add(item);
            }
        }
        return list;
    }

    private List<Map<String, Object>> queryRecentResults() throws SQLException {
        String sql = "SELECT t.id, t.user_id, u.username, u.nickname, u.avatar, " +
                     "t.mbti, t.drink_name, t.result_no, t.result_timestamp, t.result_date " +
                     "FROM test_results t LEFT JOIN users u ON t.user_id = u.id " +
                     "ORDER BY t.result_timestamp DESC LIMIT 20";
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", rs.getLong("id"));
                item.put("userId", rs.getLong("user_id"));
                item.put("username", rs.getString("username"));
                item.put("nickname", rs.getString("nickname"));
                item.put("avatar", rs.getString("avatar"));
                item.put("mbti", rs.getString("mbti"));
                item.put("drinkName", rs.getString("drink_name"));
                item.put("resultNo", rs.getString("result_no"));
                item.put("timestamp", rs.getLong("result_timestamp"));
                item.put("date", rs.getString("result_date"));
                list.add(item);
            }
        }
        return list;
    }

    private List<Map<String, Object>> queryRecentCocktails() throws SQLException {
        String sql = "SELECT c.id, c.user_id, c.partner_user_id, " +
                     "u1.username AS u1_name, u1.nickname AS u1_nick, " +
                     "u2.username AS u2_name, u2.nickname AS u2_nick, " +
                     "c.type_a, c.type_b, c.drink_name_a, c.drink_name_b, " +
                     "c.cocktail_name, c.cocktail_subtitle, c.compatibility, c.created_at " +
                     "FROM cocktails c " +
                     "LEFT JOIN users u1 ON c.user_id = u1.id " +
                     "LEFT JOIN users u2 ON c.partner_user_id = u2.id " +
                     "ORDER BY c.created_at DESC LIMIT 20";
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", rs.getLong("id"));
                item.put("userId", rs.getLong("user_id"));
                item.put("userName", rs.getString("u1_name"));
                item.put("userNick", rs.getString("u1_nick"));
                item.put("partnerName", rs.getString("u2_name"));
                item.put("partnerNick", rs.getString("u2_nick"));
                item.put("typeA", rs.getString("type_a"));
                item.put("typeB", rs.getString("type_b"));
                item.put("drinkNameA", rs.getString("drink_name_a"));
                item.put("drinkNameB", rs.getString("drink_name_b"));
                item.put("cocktailName", rs.getString("cocktail_name"));
                item.put("cocktailSubtitle", rs.getString("cocktail_subtitle"));
                item.put("compatibility", rs.getInt("compatibility"));
                item.put("createdAt", rs.getString("created_at"));
                list.add(item);
            }
        }
        return list;
    }
}
