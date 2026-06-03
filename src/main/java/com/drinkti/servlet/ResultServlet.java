package com.drinkti.servlet;

import com.drinkti.dao.TestResultDao;
import com.drinkti.model.TestResult;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/results")
public class ResultServlet extends BaseServlet {
    private final TestResultDao dao = new TestResultDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        try {
            HttpSession session = req.getSession(false);
            Long userId = null;
            if (session != null && session.getAttribute("userId") != null) {
                userId = (Long) session.getAttribute("userId");
            }

            // 未登录不返回任何数据
            if (userId == null) {
                resp.getWriter().write("null");
                return;
            }

            // ?latest=true 只返回最近一条结果
            if ("true".equals(req.getParameter("latest"))) {
                List<TestResult> all = dao.findByUserId(userId);
                if (!all.isEmpty()) {
                    resp.getWriter().write(GSON.toJson(all.get(0)));
                } else {
                    resp.getWriter().write("null");
                }
                return;
            }

            List<TestResult> results = dao.findByUserId(userId);
            resp.getWriter().write(GSON.toJson(results));
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\":\"query failed\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        try {
            String body = readBody(req.getReader());
            JsonObject json = GSON.fromJson(body, JsonObject.class);

            if (json == null || !json.has("mbti") || !json.has("drinkName") || !json.has("timestamp")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"invalid request\"}");
                return;
            }

            // 强制登录：没有登录的用户不能保存测试结果
            HttpSession session = req.getSession(false);
            if (session == null || session.getAttribute("userId") == null) {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write("{\"message\":\"请先登录再保存测试结果\"}");
                return;
            }

            TestResult result = new TestResult();
            result.setUserId((Long) session.getAttribute("userId"));
            result.setMbti(getAsString(json, "mbti"));
            result.setDrinkName(getAsString(json, "drinkName"));
            result.setScoresJson(json.has("scores") ? GSON.toJson(json.get("scores")) : "{}");
            result.setDate(getAsString(json, "date"));
            result.setNo(getAsString(json, "no"));
            result.setTimestamp(json.get("timestamp").getAsLong());

            dao.insert(result);

            Map<String, Object> ok = new HashMap<>();
            ok.put("success", true);
            resp.getWriter().write(GSON.toJson(ok));
        } catch (JsonSyntaxException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"json parse error\"}");
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\":\"save failed\"}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        try {
            int deleted = dao.deleteAll();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("deleted", deleted);
            resp.getWriter().write(GSON.toJson(result));
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\":\"delete failed\"}");
        }
    }

    private String getAsString(JsonObject json, String key) {
        return json.has(key) && !json.get(key).isJsonNull() ? json.get(key).getAsString() : "";
    }
}
