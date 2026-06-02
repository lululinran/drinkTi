package com.drinkti.servlet;

import com.drinkti.dao.CocktailDao;
import com.drinkti.dao.TestResultDao;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/collection")
public class CollectionServlet extends BaseServlet {
    private final TestResultDao dao = new TestResultDao();
    private final CocktailDao cocktailDao = new CocktailDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        try {
            Map<String, Integer> collection;
            int cocktailCount = 0;
            HttpSession session = req.getSession(false);
            if (session != null && session.getAttribute("userId") != null) {
                long userId = (Long) session.getAttribute("userId");
                collection = dao.getCollectionSummaryByUser(userId);
                cocktailCount = cocktailDao.countByUserIdOrPartner(userId);
            } else {
                collection = new HashMap<>();
                cocktailCount = 0;
            }

            Map<String, Object> result = new HashMap<>();
            result.put("collection", collection);
            result.put("cocktailCount", cocktailCount);
            resp.getWriter().write(GSON.toJson(result));
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\":\"query failed\"}");
        }
    }
}
