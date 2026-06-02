package com.drinkti.servlet;

import com.drinkti.dao.*;
import com.drinkti.model.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.*;

@WebServlet("/api/reference-data")
public class ReferenceDataServlet extends BaseServlet {
    private final QuestionDao questionDao = new QuestionDao();
    private final DrinkDao drinkDao = new DrinkDao();
    private final CocktailTemplateDao templateDao = new CocktailTemplateDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        try {
            Map<String, Object> data = new LinkedHashMap<>();

            // 题库 + 选项（转为前端格式）
            List<Question> questions = questionDao.findAllWithOptions();
            List<Map<String, Object>> qList = new ArrayList<>();
            for (Question q : questions) {
                Map<String, Object> qMap = new LinkedHashMap<>();
                qMap.put("id", q.getSortOrder());
                qMap.put("dimension", q.getDimension());
                qMap.put("question", q.getQuestionText());
                qMap.put("subtitle", q.getSubtitle());
                List<Map<String, Object>> opts = new ArrayList<>();
                String[] letters = {"E","I","S","N","T","F","J","P"};
                for (QuestionOption o : q.getOptions()) {
                    Map<String, Object> om = new LinkedHashMap<>();
                    om.put("text", o.getOptionText());
                    om.put("desc", o.getOptionDesc());
                    Map<String, Integer> score = new LinkedHashMap<>();
                    if (o.getScoreE() > 0) score.put("E", o.getScoreE());
                    if (o.getScoreI() > 0) score.put("I", o.getScoreI());
                    if (o.getScoreS() > 0) score.put("S", o.getScoreS());
                    if (o.getScoreN() > 0) score.put("N", o.getScoreN());
                    if (o.getScoreT() > 0) score.put("T", o.getScoreT());
                    if (o.getScoreF() > 0) score.put("F", o.getScoreF());
                    if (o.getScoreJ() > 0) score.put("J", o.getScoreJ());
                    if (o.getScoreP() > 0) score.put("P", o.getScoreP());
                    om.put("score", score);
                    opts.add(om);
                }
                qMap.put("options", opts);
                qList.add(qMap);
            }
            data.put("questions", qList);

            // 饮料人格
            List<Drink> drinks = drinkDao.findAll();
            Map<String, Map<String, Object>> dMap = new LinkedHashMap<>();
            for (Drink d : drinks) {
                Map<String, Object> dm = new LinkedHashMap<>();
                dm.put("name", d.getName());
                dm.put("en", d.getEnName());
                dm.put("color", d.getColor());
                dm.put("slogan", d.getSlogan());
                dm.put("description", d.getDescription());
                dm.put("tags", GSON.fromJson(d.getTagsJson(), List.class));
                dm.put("glassShape", d.getGlassShape());
                dMap.put(d.getMbti(), dm);
            }
            data.put("drinks", dMap);

            // 特调模板
            List<CocktailTemplate> templates = templateDao.findAllTemplates();
            List<Map<String, Object>> tList = new ArrayList<>();
            for (CocktailTemplate t : templates) {
                Map<String, Object> tm = new LinkedHashMap<>();
                tm.put("diffGroup", t.getDiffGroup());
                tm.put("sortOrder", t.getSortOrder());
                tm.put("name", t.getName());
                tm.put("subtitle", t.getSubtitle());
                tm.put("notes", t.getNotes());
                tList.add(tm);
            }
            data.put("cocktailTemplates", tList);

            // 特殊配对
            List<SpecialPair> sps = templateDao.findAllSpecialPairs();
            List<Map<String, Object>> spList = new ArrayList<>();
            for (SpecialPair sp : sps) {
                Map<String, Object> sm = new LinkedHashMap<>();
                sm.put("typeA", sp.getTypeA());
                sm.put("typeB", sp.getTypeB());
                sm.put("name", sp.getName());
                sm.put("subtitle", sp.getSubtitle());
                sm.put("notes", sp.getNotes());
                spList.add(sm);
            }
            data.put("specialPairs", spList);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("success", true);
            result.put("data", data);
            resp.getWriter().write(GSON.toJson(result));
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"message\":\"query failed\"}");
        }
    }
}
