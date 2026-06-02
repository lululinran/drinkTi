package com.drinkti.model;

import java.util.List;

public class Question {
    private Long id;
    private int sortOrder;
    private String dimension;
    private String questionText;
    private String subtitle;
    private List<QuestionOption> options;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public String getDimension() { return dimension; }
    public void setDimension(String dimension) { this.dimension = dimension; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public List<QuestionOption> getOptions() { return options; }
    public void setOptions(List<QuestionOption> options) { this.options = options; }
}
