package com.drinkti.model;

public class SpecialPair {
    private Long id;
    private String typeA;
    private String typeB;
    private String name;
    private String subtitle;
    private String notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTypeA() { return typeA; }
    public void setTypeA(String typeA) { this.typeA = typeA; }
    public String getTypeB() { return typeB; }
    public void setTypeB(String typeB) { this.typeB = typeB; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
