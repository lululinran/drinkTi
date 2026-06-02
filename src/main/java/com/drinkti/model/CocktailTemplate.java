package com.drinkti.model;

public class CocktailTemplate {
    private Long id;
    private String diffGroup;
    private int sortOrder;
    private String name;
    private String subtitle;
    private String notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDiffGroup() { return diffGroup; }
    public void setDiffGroup(String diffGroup) { this.diffGroup = diffGroup; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
