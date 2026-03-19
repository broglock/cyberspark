describe('Persona System', () => {
  localStorage.clear();

  it('PERSONAS contains 5 personas', () => {
    expect(PERSONAS.length).toBe(5);
  });

  it('each persona has required fields', () => {
    for (const p of PERSONAS) {
      expect(typeof p.id).toBe('string');
      expect(typeof p.name).toBe('string');
      expect(typeof p.icon).toBe('string');
      expect(typeof p.tagline).toBe('string');
      expect(typeof p.color).toBe('string');
      expect(Array.isArray(p.primarySections)).toBeTruthy();
    }
  });

  it('getPersona returns null if not set', () => {
    localStorage.removeItem('cyberspark_persona');
    expect(getPersona()).toBe(null);
  });

  it('setPersona stores persona id in localStorage', () => {
    setPersona('hacker');
    expect(localStorage.getItem('cyberspark_persona')).toBe('hacker');
  });

  it('getPersona returns the stored persona object', () => {
    setPersona('builder');
    const p = getPersona();
    expect(p.id).toBe('builder');
  });

  it('setPersona sets persona_changed flag on second call', () => {
    localStorage.setItem('cyberspark_persona', 'explorer');
    setPersona('hacker');
    expect(localStorage.getItem('cyberspark_persona_changed')).toBe('1');
  });
});
