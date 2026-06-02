package com.drinkti.servlet;

import com.drinkti.util.DbUtil;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;

@WebServlet("/api/health")
public class HealthServlet extends BaseServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        try (Connection ignored = DbUtil.getConnection()) {
            resp.getWriter().write("{\"status\":\"ok\",\"db\":\"up\"}");
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"status\":\"error\",\"db\":\"down\"}");
        }
    }
}
