package com.drinkti.servlet;

import com.drinkti.dao.UserDao;
import com.drinkti.model.User;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/auth/*")
public class AuthServlet extends BaseServlet {
    private final UserDao userDao = new UserDao();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || "/login".equals(pathInfo)) {
            handleLogin(req, resp);
        } else if ("/register".equals(pathInfo)) {
            handleRegister(req, resp);
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"message\":\"not found\"}");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");

        String pathInfo = req.getPathInfo();
        if ("/me".equals(pathInfo)) {
            handleMe(req, resp);
        } else if ("/logout".equals(pathInfo)) {
            handleLogout(req, resp);
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"message\":\"not found\"}");
        }
    }

    /**
     * POST /api/auth/register
     * Body: { username, password, nickname? }
     */
    private void handleRegister(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            String body = readBody(req.getReader());
            JsonObject json = GSON.fromJson(body, JsonObject.class);

            if (json == null || !json.has("username") || !json.has("password")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"用户名和密码不能为空\"}");
                return;
            }

            String username = json.get("username").getAsString().trim();
            String password = json.get("password").getAsString();

            if (username.length() < 2 || username.length() > 32) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"用户名长度需要 2-32 个字符\"}");
                return;
            }

            if (password.length() < 4) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"密码至少需要 4 个字符\"}");
                return;
            }

            // 检查用户名是否已存在
            User existing = userDao.findByUsername(username);
            if (existing != null) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                resp.getWriter().write("{\"message\":\"用户名已存在\"}");
                return;
            }

            User user = new User();
            user.setUsername(username);
            user.setPasswordHash(hashPassword(password));
            user.setNickname(json.has("nickname") ? json.get("nickname").getAsString() : username);

            long id = userDao.insert(user);
            if (id < 0) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("{\"message\":\"注册失败\"}");
                return;
            }

            user.setId(id);

            // 注册成功后自动登录
            HttpSession session = req.getSession(true);
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("user", userToMap(user));
            resp.getWriter().write(GSON.toJson(result));

        } catch (JsonSyntaxException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"JSON 格式错误\"}");
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\":\"服务器错误\"}");
        }
    }

    /**
     * POST /api/auth/login
     * Body: { username, password }
     */
    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            String body = readBody(req.getReader());
            JsonObject json = GSON.fromJson(body, JsonObject.class);

            if (json == null || !json.has("username") || !json.has("password")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"用户名和密码不能为空\"}");
                return;
            }

            String username = json.get("username").getAsString().trim();
            String password = json.get("password").getAsString();

            User user = userDao.findByUsername(username);
            if (user == null || !user.getPasswordHash().equals(hashPassword(password))) {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write("{\"message\":\"用户名或密码错误\"}");
                return;
            }

            HttpSession session = req.getSession(true);
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("user", userToMap(user));
            resp.getWriter().write(GSON.toJson(result));

        } catch (JsonSyntaxException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"message\":\"JSON 格式错误\"}");
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\":\"服务器错误\"}");
        }
    }

    /**
     * GET /api/auth/me — 获取当前登录用户信息
     */
    private void handleMe(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"message\":\"未登录\"}");
            return;
        }

        try {
            long userId = (Long) session.getAttribute("userId");
            User user = userDao.findById(userId);
            if (user == null) {
                session.invalidate();
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write("{\"message\":\"用户不存在\"}");
                return;
            }

            Map<String, Object> result = new HashMap<>();
            result.put("loggedIn", true);
            result.put("user", userToMap(user));
            resp.getWriter().write(GSON.toJson(result));

        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\":\"服务器错误\"}");
        }
    }

    /**
     * GET /api/auth/logout — 退出登录
     */
    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        resp.getWriter().write("{\"success\":true,\"message\":\"已退出登录\"}");
    }

    private Map<String, Object> userToMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("nickname", user.getNickname());
        map.put("avatar", user.getAvatar());
        return map;
    }

    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
