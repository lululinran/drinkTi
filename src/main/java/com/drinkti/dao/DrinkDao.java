package com.drinkti.dao;

import com.drinkti.model.Drink;
import com.drinkti.util.DbUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DrinkDao {

    public List<Drink> findAll() throws SQLException {
        String sql = "SELECT mbti, name, en_name, color, slogan, description, tags_json, glass_shape FROM drinks ORDER BY mbti";
        List<Drink> list = new ArrayList<>();
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Drink d = new Drink();
                d.setMbti(rs.getString("mbti"));
                d.setName(rs.getString("name"));
                d.setEnName(rs.getString("en_name"));
                d.setColor(rs.getString("color"));
                d.setSlogan(rs.getString("slogan"));
                d.setDescription(rs.getString("description"));
                d.setTagsJson(rs.getString("tags_json"));
                d.setGlassShape(rs.getString("glass_shape"));
                list.add(d);
            }
        }
        return list;
    }
}
