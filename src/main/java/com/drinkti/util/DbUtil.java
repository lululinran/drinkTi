package com.drinkti.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

public final class DbUtil {
    private static final HikariDataSource DATA_SOURCE;

    static {
        Properties props = new Properties();
        try (InputStream in = DbUtil.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (in == null) {
                throw new IllegalStateException("Cannot find db.properties");
            }
            props.load(in);
        } catch (IOException e) {
            throw new ExceptionInInitializerError(e);
        }

        String url = System.getenv().getOrDefault("DB_URL", props.getProperty("db.url"));
        String username = System.getenv().getOrDefault("DB_USERNAME", props.getProperty("db.username"));
        String password = System.getenv().getOrDefault("DB_PASSWORD", props.getProperty("db.password"));

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");

        // 连接池配置
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(10000);
        config.setMaxLifetime(600000);
        config.setPoolName("DrinkTi-Pool");

        // 连接测试
        config.setConnectionTestQuery("SELECT 1");
        config.setValidationTimeout(3000);

        DATA_SOURCE = new HikariDataSource(config);
    }

    private DbUtil() {
    }

    public static Connection getConnection() throws SQLException {
        return DATA_SOURCE.getConnection();
    }

    public static void shutdown() {
        if (DATA_SOURCE != null && !DATA_SOURCE.isClosed()) {
            DATA_SOURCE.close();
        }
    }
}
