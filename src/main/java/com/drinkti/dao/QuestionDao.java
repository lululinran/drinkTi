package com.drinkti.dao;

import com.drinkti.model.Question;
import com.drinkti.model.QuestionOption;
import com.drinkti.util.DbUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class QuestionDao {

    public List<Question> findAllWithOptions() throws SQLException {
        String sql = "SELECT q.id AS qid, q.sort_order AS qsort, q.dimension, q.question_text, q.subtitle, " +
                     "o.id AS oid, o.sort_order AS osort, o.option_text, o.option_desc, " +
                     "o.score_e, o.score_i, o.score_s, o.score_n, o.score_t, o.score_f, o.score_j, o.score_p " +
                     "FROM questions q " +
                     "LEFT JOIN question_options o ON q.id = o.question_id " +
                     "ORDER BY q.sort_order, o.sort_order";
        Map<Long, Question> map = new LinkedHashMap<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                long qid = rs.getLong("qid");
                Question q = map.computeIfAbsent(qid, k -> {
                    Question nq = new Question();
                    try {
                        nq.setId(k);
                        nq.setSortOrder(rs.getInt("qsort"));
                        nq.setDimension(rs.getString("dimension"));
                        nq.setQuestionText(rs.getString("question_text"));
                        nq.setSubtitle(rs.getString("subtitle"));
                        nq.setOptions(new ArrayList<>());
                    } catch (SQLException e) { throw new RuntimeException(e); }
                    return nq;
                });
                long oid = rs.getLong("oid");
                if (!rs.wasNull()) {
                    QuestionOption opt = new QuestionOption();
                    opt.setId(oid);
                    opt.setQuestionId(qid);
                    opt.setSortOrder(rs.getInt("osort"));
                    opt.setOptionText(rs.getString("option_text"));
                    opt.setOptionDesc(rs.getString("option_desc"));
                    opt.setScoreE(rs.getInt("score_e"));
                    opt.setScoreI(rs.getInt("score_i"));
                    opt.setScoreS(rs.getInt("score_s"));
                    opt.setScoreN(rs.getInt("score_n"));
                    opt.setScoreT(rs.getInt("score_t"));
                    opt.setScoreF(rs.getInt("score_f"));
                    opt.setScoreJ(rs.getInt("score_j"));
                    opt.setScoreP(rs.getInt("score_p"));
                    q.getOptions().add(opt);
                }
            }
        }
        return new ArrayList<>(map.values());
    }
}
