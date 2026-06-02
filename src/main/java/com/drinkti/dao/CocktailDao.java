package com.drinkti.dao;

import com.drinkti.model.Cocktail;
import com.drinkti.util.DbUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CocktailDao {

    public void insert(Cocktail c) throws SQLException {
        String sql = "INSERT INTO cocktails (user_id, partner_user_id, type_a, type_b, drink_name_a, drink_name_b, " +
                     "cocktail_name, cocktail_subtitle, notes, compatibility) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            if (c.getUserId() != null) {
                ps.setLong(1, c.getUserId());
            } else {
                ps.setNull(1, Types.BIGINT);
            }
            if (c.getPartnerUserId() != null) {
                ps.setLong(2, c.getPartnerUserId());
            } else {
                ps.setNull(2, Types.BIGINT);
            }
            ps.setString(3, c.getTypeA());
            ps.setString(4, c.getTypeB());
            ps.setString(5, c.getDrinkNameA());
            ps.setString(6, c.getDrinkNameB());
            ps.setString(7, c.getCocktailName());
            ps.setString(8, c.getCocktailSubtitle());
            ps.setString(9, c.getNotes());
            ps.setInt(10, c.getCompatibility());
            ps.executeUpdate();
        }
    }

    public List<Cocktail> findAll() throws SQLException {
        String sql = "SELECT * FROM cocktails ORDER BY created_at DESC LIMIT 100";
        List<Cocktail> list = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        }
        return list;
    }

    /**
     * 查询用户的特调记录，包含自己是发起者 OR 被邀请为 partner 的记录
     */
    public List<Cocktail> findByUserIdOrPartner(long userId) throws SQLException {
        String sql = "SELECT * FROM cocktails WHERE user_id = ? OR partner_user_id = ? " +
                     "ORDER BY created_at DESC LIMIT 100";
        List<Cocktail> list = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setLong(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public int countByUserIdOrPartner(long userId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM cocktails WHERE user_id = ? OR partner_user_id = ?";
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setLong(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getInt(1) : 0;
            }
        }
    }

    public int countAll() throws SQLException {
        String sql = "SELECT COUNT(*) FROM cocktails";
        try (Connection conn = DbUtil.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    public boolean existsByUserIdAndTypes(Long userId, String typeA, String typeB) throws SQLException {
        // 去重：同一用户(含partner)同一类型对只保留一条
        String sql = "SELECT COUNT(*) FROM cocktails WHERE (user_id <=> ? OR partner_user_id <=> ?) AND " +
                     "((type_a = ? AND type_b = ?) OR (type_a = ? AND type_b = ?))";
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            if (userId != null) {
                ps.setLong(1, userId);
                ps.setLong(2, userId);
            } else {
                ps.setNull(1, Types.BIGINT);
                ps.setNull(2, Types.BIGINT);
            }
            ps.setString(3, typeA);
            ps.setString(4, typeB);
            ps.setString(5, typeB);
            ps.setString(6, typeA);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }

    /**
     * 根据ID查询单条特调（带双方用户名）
     */
    public CocktailDetail findDetailById(long id) throws SQLException {
        String sql = "SELECT c.*, " +
                     "u1.username AS initiator_username, u1.nickname AS initiator_nickname, u1.avatar AS initiator_avatar, " +
                     "u2.username AS partner_username, u2.nickname AS partner_nickname, u2.avatar AS partner_avatar " +
                     "FROM cocktails c " +
                     "LEFT JOIN users u1 ON c.user_id = u1.id " +
                     "LEFT JOIN users u2 ON c.partner_user_id = u2.id " +
                     "WHERE c.id = ?";
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Cocktail c = mapRow(rs);
                    CocktailDetail detail = new CocktailDetail();
                    detail.cocktail = c;
                    detail.initiatorUsername = rs.getString("initiator_username");
                    detail.initiatorNickname = rs.getString("initiator_nickname");
                    detail.initiatorAvatar = rs.getString("initiator_avatar");
                    detail.partnerUsername = rs.getString("partner_username");
                    detail.partnerNickname = rs.getString("partner_nickname");
                    detail.partnerAvatar = rs.getString("partner_avatar");
                    long uid = rs.getLong("user_id");
                    detail.initiatorId = rs.wasNull() ? null : uid;
                    long pid = rs.getLong("partner_user_id");
                    detail.partnerId = rs.wasNull() ? null : pid;
                    return detail;
                }
            }
        }
        return null;
    }

    /**
     * 结果载体
     */
    public static class CocktailDetail {
        public Cocktail cocktail;
        public String initiatorUsername;
        public String initiatorNickname;
        public String initiatorAvatar;
        public Long initiatorId;
        public String partnerUsername;
        public String partnerNickname;
        public String partnerAvatar;
        public Long partnerId;
    }

    private Cocktail mapRow(ResultSet rs) throws SQLException {
        Cocktail c = new Cocktail();
        c.setId(rs.getLong("id"));
        long uid = rs.getLong("user_id");
        if (!rs.wasNull()) c.setUserId(uid);
        long pid = rs.getLong("partner_user_id");
        if (!rs.wasNull()) c.setPartnerUserId(pid);
        c.setTypeA(rs.getString("type_a"));
        c.setTypeB(rs.getString("type_b"));
        c.setDrinkNameA(rs.getString("drink_name_a"));
        c.setDrinkNameB(rs.getString("drink_name_b"));
        c.setCocktailName(rs.getString("cocktail_name"));
        c.setCocktailSubtitle(rs.getString("cocktail_subtitle"));
        c.setNotes(rs.getString("notes"));
        c.setCompatibility(rs.getInt("compatibility"));
        c.setCreatedAt(rs.getString("created_at"));
        return c;
    }
}
