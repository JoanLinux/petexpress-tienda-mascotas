-- Agregar rol de admin al usuario iris
INSERT INTO user_roles (user_id, role, created_by) 
VALUES ('0ceef78b-5383-44ba-9104-ef08be4d55bd', 'admin', '50c9c070-0859-4602-a7b1-9e2e0f8087fb')
ON CONFLICT (user_id, role) DO NOTHING;