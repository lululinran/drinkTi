package com.drinkti.servlet;

import com.drinkti.dao.CocktailDao;
import com.drinkti.model.Cocktail;
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

@WebServlet("/api/cocktails")
public class CocktailServlet extends BaseServlet {
    private final CocktailDao dao = new CocktailDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");

        // 详情查询：?id=xxx
        String idParam = req.getParameter("id");
        if (idParam != null && !idParam.isEmpty()) {
            try {
                long id = Long.parseLong(idParam);
                CocktailDao.CocktailDetail detail = dao.findDetailById(id);
                if (detail == null) {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    resp.getWriter().write("{\"message\":\"cocktail not found\"}");
                    return;
                }

                HttpSession session = req.getSession(false);
                Long myUserId = (session != null && session.getAttribute("userId") != null)
                    ? (Long) session.getAttribute("userId") : null;

                // 组装返回
                Map<String, Object> result = new HashMap<>();
                result.put("id", detail.cocktail.getId());
                result.put("typeA", detail.cocktail.getTypeA());
                result.put("typeB", detail.cocktail.getTypeB());
                result.put("drinkNameA", detail.cocktail.getDrinkNameA());
                result.put("drinkNameB", detail.cocktail.getDrinkNameB());
                result.put("cocktailName", detail.cocktail.getCocktailName());
                result.put("cocktailSubtitle", detail.cocktail.getCocktailSubtitle());
                result.put("notes", detail.cocktail.getNotes());
                result.put("compatibility", detail.cocktail.getCompatibility());
                result.put("createdAt", detail.cocktail.getCreatedAt());
                result.put("userId", detail.cocktail.getUserId());
                result.put("partnerUserId", detail.cocktail.getPartnerUserId());

                // 发起者信息
                Map<String, Object> initiator = new HashMap<>();
                initiator.put("id", detail.initiatorId);
                initiator.put("username", detail.initiatorUsername);
                initiator.put("nickname", detail.initiatorNickname);
                initiator.put("avatar", detail.initiatorAvatar);
                if (myUserId != null && detail.initiatorId != null && myUserId.equals(detail.initiatorId)) {
                    initiator.put("isMe", true);
                }
                result.put("initiator", initiator);

                // 朋友信息
                Map<String, Object> partner = new HashMap<>();
                partner.put("id", detail.partnerId);
                partner.put("username", detail.partnerUsername);
                partner.put("nickname", detail.partnerNickname);
                partner.put("avatar", detail.partnerAvatar);
                if (myUserId != null && detail.partnerId != null && myUserId.equals(detail.partnerId)) {
                    partner.put("isMe", true);
                }
                result.put("partner", partner);

                resp.getWriter().write(GSON.toJson(result));
                return;
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"invalid id\"}");
                return;
            } catch (SQLException e) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("{\"message\":\"query failed\"}");
                return;
            }
        }

        // 列表查询
        try {
            HttpSession session = req.getSession(false);
            List<Cocktail> cocktails;
            if (session != null && session.getAttribute("userId") != null) {
                long userId = (Long) session.getAttribute("userId");
                // 查询：我是发起者 OR 我是 partner
                cocktails = dao.findByUserIdOrPartner(userId);
            } else {
                cocktails = dao.findAll();
            }
            resp.getWriter().write(GSON.toJson(cocktails));
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

            if (json == null || !json.has("typeA") || !json.has("typeB")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"message\":\"invalid request\"}");
                return;
            }

            Cocktail c = new Cocktail();

            HttpSession session = req.getSession(false);
            Long userId = null;
            if (session != null && session.getAttribute("userId") != null) {
                userId = (Long) session.getAttribute("userId");
                c.setUserId(userId);
            }

            c.setTypeA(json.get("typeA").getAsString());
            c.setTypeB(json.get("typeB").getAsString());

            // 从请求中读取朋友(partner)的用户ID
            if (json.has("partnerUserId") && !json.get("partnerUserId").isJsonNull()) {
                c.setPartnerUserId(json.get("partnerUserId").getAsLong());
            }

            // 去重：同一类型对只保留一条
            if (dao.existsByUserIdAndTypes(userId, c.getTypeA(), c.getTypeB())) {
                Map<String, Object> dup = new HashMap<>();
                dup.put("success", true);
                dup.put("duplicate", true);
                resp.getWriter().write(GSON.toJson(dup));
                return;
            }

            c.setDrinkNameA(getAsString(json, "drinkNameA"));
            c.setDrinkNameB(getAsString(json, "drinkNameB"));
            c.setCocktailName(getAsString(json, "cocktailName"));
            c.setCocktailSubtitle(getAsString(json, "cocktailSubtitle"));
            c.setNotes(getAsString(json, "notes"));
            c.setCompatibility(json.has("compatibility") ? json.get("compatibility").getAsInt() : 50);

            dao.insert(c);

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

    private String getAsString(JsonObject json, String key) {
        return json.has(key) && !json.get(key).isJsonNull() ? json.get(key).getAsString() : "";
    }
}
