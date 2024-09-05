export function isLogged(): boolean {
  return !!(typeof window !== 'undefined' && window.sessionStorage.getItem('user'))
}
