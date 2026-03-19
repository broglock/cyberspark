describe('XP System', () => {
  // Reset localStorage before each test group
  localStorage.clear();

  it('awardXP increases cyberspark_xp in localStorage', () => {
    localStorage.setItem('cyberspark_xp', '0');
    awardXP(25, 'test');
    expect(parseInt(localStorage.getItem('cyberspark_xp'))).toBe(25);
  });

  it('awardXP accumulates multiple awards', () => {
    localStorage.setItem('cyberspark_xp', '0');
    awardXP(25, 'first');
    awardXP(50, 'second');
    expect(parseInt(localStorage.getItem('cyberspark_xp'))).toBe(75);
  });

  it('getXP returns current XP total', () => {
    localStorage.setItem('cyberspark_xp', '100');
    expect(getXP()).toBe(100);
  });

  it('getXP returns 0 if not set', () => {
    localStorage.removeItem('cyberspark_xp');
    expect(getXP()).toBe(0);
  });

  it('getBadges returns empty array if none earned', () => {
    localStorage.removeItem('cyberspark_badges');
    expect(getBadges()).toEqual([]);
  });

  it('hasBadge returns false for unearned badge', () => {
    localStorage.setItem('cyberspark_badges', '[]');
    expect(hasBadge('first_cipher')).toBeFalsy();
  });

  it('BADGE_REGISTRY contains all 18 defined badges', () => {
    expect(BADGE_REGISTRY.length).toBe(18);
  });

  it('BADGE_REGISTRY badge has required fields', () => {
    const badge = BADGE_REGISTRY[0];
    expect(typeof badge.id).toBe('string');
    expect(typeof badge.name).toBe('string');
    expect(typeof badge.icon).toBe('string');
    expect(typeof badge.unlockFn).toBe('function');
  });

  it('career_explorer badge unlocks when careersExplored >= 8', () => {
    localStorage.clear();
    localStorage.setItem('cyberspark_careers_explored', '8');
    checkBadges();
    expect(hasBadge('career_explorer')).toBeTruthy();
  });
});
