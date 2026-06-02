package com.drinkti.servlet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import javax.servlet.http.HttpServlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.stream.Collectors;

public abstract class BaseServlet extends HttpServlet {
    protected static final Gson GSON = new GsonBuilder().serializeNulls().create();

    protected String readBody(BufferedReader reader) throws IOException {
        return reader.lines().collect(Collectors.joining(System.lineSeparator()));
    }
}
