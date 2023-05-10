export function validarEmail(email) {
  const regex = /^(?!\s*$)\S+@\S+\.\S+$/;
  if (!regex.test(email)) {
    return 'Email inválido';
  }
  return null;
}

export function validarUsername(username) {
  const regex = /^[a-zA-Z0-9_-]{4,16}$/;
  if (username.length < 4) {
    return 'O usuário tem que ter no mínimo 4 caracteres';
  }
  if (!regex.test(username)) {
    return 'Usuário inválido';
  }
  return '';
}

export function validarPassword(password) {
  const regex = /^.{6,}$/;
  if (password.length < 6) {
    return 'A senha tem que ter no mínimo 6 caracteres';
  }
  if (!regex.test(password)) {
    return 'Senha inválida';
  }
  return null;
}

