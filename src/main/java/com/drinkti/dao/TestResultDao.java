package com.drinkti.dao;

import com.drinkti.model.TestResult;
import com.drinkti.util.DbUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TestResultDao {

    public void insert(TestResult result) throws SQLException {
        String sql = "INSERT INTO test_results (user_id, mbti, drink_name, scores_json, result_date, result_no, result_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            if (result.getUserId() != null) {
                ps.setLong(1, result.getUserId());
            } else {
                ps.setNull(1, java.sql.Types.BIGINT);
            }
            ps.setString(2, result.getMbti());
            ps.setString(3, result.getDrinkName());
            ps.setString(4, result.getScoresJson());
            ps.setString(5, result.getDate());
            ps.setString(6, result.getNo());
            ps.setLong(7, result.getTimestamp());
            ps.executeUpdate();
        }
    }

    public List<TestResult> findAll() throws SQLException {
        String sql = "SELECT id, user_id, mbti, drink_name, scores_json, result_date, result_no, result_timestamp FROM test_results ORDER BY result_timestamp DESC";
        List<TestResult> results = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                results.add(mapRow(rs));
            }
        }
        return results;
    }

    /**
     * 分页查询
     */
    public List<TestResult> findPage(int page, int size) throws SQLException {
        String sql = "SELECT id, user_id, mbti, drink_name, scores_json, result_date, result_no, result_timestamp FROM test_results ORDER BY result_timestamp DESC LIMIT ? OFFSET ?";
        List<TestResult> results = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, size);
            ps.setInt(2, (page - 1) * size);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    results.add(mapRow(rs));
                }
            }
        }
        return results;
    }

    /**
     * 查询某个用户的所有结果
     */
    public List<TestResult> findByUserId(long userId) throws SQLException {
        String sql = "SELECT id, user_id, mbti, drink_name, scores_json, result_date, result_no, result_timestamp FROM test_results WHERE user_id = ? ORDER BY result_timestamp DESC";
        List<TestResult> results = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    results.add(mapRow(rs));
                }
            }
        }
        return results;
    }

    public Map<String, Integer> getCollectionSummary() throws SQLException {
        String sql = "SELECT mbti, COUNT(*) AS total FROM test_results GROUP BY mbti";
        Map<String, Integer> map = new HashMap<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                map.put(rs.getString("mbti"), rs.getInt("total"));
            }
        }
        return map;
    }

    public Map<String, Integer> getCollectionSummaryByUser(long userId) throws SQLException {
        String sql = "SELECT mbti, COUNT(*) AS total FROM test_results WHERE user_id = ? GROUP BY mbti";
        Map<String, Integer> map = new HashMap<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    map.put(rs.getString("mbti"), rs.getInt("total"));
                }
            }
        }
        return map;
    }

    public int deleteAll() throws SQLException {
        String sql = "DELETE FROM test_results";
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            return ps.executeUpdate();
        }
    }

    private TestResult mapRow(ResultSet rs) throws SQLException {
        TestResult result = new TestResult();
        result.setId(rs.getLong("id"));
        long userId = rs.getLong("user_id");
        if (!rs.wasNull()) {
            result.setUserId(userId);
        }
        result.setMbti(rs.getString("mbti"));
        result.setDrinkName(rs.getString("drink_name"));
        result.setScoresJson(rs.getString("scores_json"));
        result.setDate(rs.getString("result_date"));
        result.setNo(rs.getString("result_no"));
        result.setTimestamp(rs.getLong("result_timestamp"));
        return result;
    }
}
