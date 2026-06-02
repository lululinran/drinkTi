package com.drinkti.model;

public class Cocktail {
    private Long id;
    private Long userId;
    private Long partnerUserId;
    private String typeA;
    private String typeB;
    private String drinkNameA;
    private String drinkNameB;
    private String cocktailName;
    private String cocktailSubtitle;
    private String notes;
    private int compatibility;
    private String createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getPartnerUserId() { return partnerUserId; }
    public void setPartnerUserId(Long partnerUserId) { this.partnerUserId = partnerUserId; }

    public String getTypeA() { return typeA; }
    public void setTypeA(String typeA) { this.typeA = typeA; }

    public String getTypeB() { return typeB; }
    public void setTypeB(String typeB) { this.typeB = typeB; }

    public String getDrinkNameA() { return drinkNameA; }
    public void setDrinkNameA(String drinkNameA) { this.drinkNameA = drinkNameA; }

    public String getDrinkNameB() { return drinkNameB; }
    public void setDrinkNameB(String drinkNameB) { this.drinkNameB = drinkNameB; }

    public String getCocktailName() { return cocktailName; }
    public void setCocktailName(String cocktailName) { this.cocktailName = cocktailName; }

    public String getCocktailSubtitle() { return cocktailSubtitle; }
    public void setCocktailSubtitle(String cocktailSubtitle) { this.cocktailSubtitle = cocktailSubtitle; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public int getCompatibility() { return compatibility; }
    public void setCompatibility(int compatibility) { this.compatibility = compatibility; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
