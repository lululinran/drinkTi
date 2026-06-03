package com.drinkti.dao;

import com.drinkti.model.CocktailTemplate;
import com.drinkti.model.SpecialPair;
import com.drinkti.util.DbUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class CocktailTemplateDao {

    public List<CocktailTemplate> findAllTemplates() throws SQLException {
        String sql = "SELECT id, diff_group, sort_order, name, subtitle, notes FROM cocktail_templates ORDER BY FIELD(diff_group,'same','diff1','diff2','diff3','opposite'), sort_order";
        List<CocktailTemplate> list = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                CocktailTemplate t = new CocktailTemplate();
                t.setId(rs.getLong("id"));
                t.setDiffGroup(rs.getString("diff_group"));
                t.setSortOrder(rs.getInt("sort_order"));
                t.setName(rs.getString("name"));
                t.setSubtitle(rs.getString("subtitle"));
                t.setNotes(rs.getString("notes"));
                list.add(t);
            }
        }
        return list;
    }

    public int countAll() throws SQLException {
        String sql = "SELECT COUNT(*) FROM cocktail_templates";
        try (Connection conn = DbUtil.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    public List<SpecialPair> findAllSpecialPairs() throws SQLException {
        String sql = "SELECT id, type_a, type_b, name, subtitle, notes FROM special_pairs ORDER BY id";
        List<SpecialPair> list = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                SpecialPair sp = new SpecialPair();
                sp.setId(rs.getLong("id"));
                sp.setTypeA(rs.getString("type_a"));
                sp.setTypeB(rs.getString("type_b"));
                sp.setName(rs.getString("name"));
                sp.setSubtitle(rs.getString("subtitle"));
                sp.setNotes(rs.getString("notes"));
                list.add(sp);
            }
        }
        return list;
    }
}
