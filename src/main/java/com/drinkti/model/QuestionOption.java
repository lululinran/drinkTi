package com.drinkti.model;

public class QuestionOption {
    private Long id;
    private Long questionId;
    private int sortOrder;
    private String optionText;
    private String optionDesc;
    private int scoreE;
    private int scoreI;
    private int scoreS;
    private int scoreN;
    private int scoreT;
    private int scoreF;
    private int scoreJ;
    private int scoreP;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public String getOptionText() { return optionText; }
    public void setOptionText(String optionText) { this.optionText = optionText; }
    public String getOptionDesc() { return optionDesc; }
    public void setOptionDesc(String optionDesc) { this.optionDesc = optionDesc; }
    public int getScoreE() { return scoreE; }
    public void setScoreE(int scoreE) { this.scoreE = scoreE; }
    public int getScoreI() { return scoreI; }
    public void setScoreI(int scoreI) { this.scoreI = scoreI; }
    public int getScoreS() { return scoreS; }
    public void setScoreS(int scoreS) { this.scoreS = scoreS; }
    public int getScoreN() { return scoreN; }
    public void setScoreN(int scoreN) { this.scoreN = scoreN; }
    public int getScoreT() { return scoreT; }
    public void setScoreT(int scoreT) { this.scoreT = scoreT; }
    public int getScoreF() { return scoreF; }
    public void setScoreF(int scoreF) { this.scoreF = scoreF; }
    public int getScoreJ() { return scoreJ; }
    public void setScoreJ(int scoreJ) { this.scoreJ = scoreJ; }
    public int getScoreP() { return scoreP; }
    public void setScoreP(int scoreP) { this.scoreP = scoreP; }
}
