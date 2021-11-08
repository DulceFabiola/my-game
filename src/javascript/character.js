class Character {
  constructor(health, strength) {
    this.health = health;
    this.strength = strength;
  }
  attack() {
    return this.strength;
  }
  receiveDamage(damage) {
    this.health -= damage;
  }
}

class Monster extends Character {
  constructor(name, health, strength) {
    super(health, strength);
    this.name = name;
  }
  receiveDamage(damage) {
    this.health -= damage;
    if (this.health > 0) {
      return `${this.name} ha recibido ${damage} puntos de daño`;
    } else {
      return `${this.name}: Tenemos un 3312`;
    }
  }
  battleCry() {
    return "Sustos que dan gusto.";
  }
}

class Kid extends Character {
  constructor(health, strength) {
    super(health, strength);
  }
  receiveDamage(damage) {
    this.health -= damage;
    if (this.health > 0) {
      return `El niño ha generado ${damage} puntos de energia`;
    } else {
      return `El niño se ha ido a dormir`;
    }
  }
  battleCry() {
    return "Gatito";
  }
}
