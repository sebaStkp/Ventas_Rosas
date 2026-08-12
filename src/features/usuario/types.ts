export type UsuarioDTO = {
  id: string;
  nombre: string;
  ci: string;
  telefono: string;
};

export type CreateUsuarioDTO = Omit<UsuarioDTO, "id">;
export type UpdateUsuarioDTO = Pick<UsuarioDTO, "id"> & Partial<CreateUsuarioDTO>;