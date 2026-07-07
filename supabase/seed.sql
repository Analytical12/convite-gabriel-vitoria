-- seed.sql
-- Example data for local development. Codes, names and amounts are all
-- placeholders — replace with real household/guest data before go-live.

insert into admin_users (email) values
  ('gabrielgerhard10@gmail.com');

-- households -----------------------------------------------------------

insert into households (id, code, display_name, type, max_invited, notes) values
  ('11111111-1111-1111-1111-111111111111', 'GV-FAMILIA', 'Família Exemplo', 'family', 4, 'Convidado de exemplo — substituir por dados reais.'),
  ('22222222-2222-2222-2222-222222222222', 'GV-SOLO', 'Convidado Individual Exemplo', 'individual', 1, 'Convidado de exemplo — substituir por dados reais.');

-- guests ------------------------------------------------------------------

insert into guests (household_id, full_name, age_group, sort_order) values
  ('11111111-1111-1111-1111-111111111111', 'Nome Sobrenome (adulto 1)', 'adult', 1),
  ('11111111-1111-1111-1111-111111111111', 'Nome Sobrenome (adulto 2)', 'adult', 2),
  ('11111111-1111-1111-1111-111111111111', 'Nome Sobrenome (criança 10+)', 'child_10_plus', 3),
  ('11111111-1111-1111-1111-111111111111', 'Nome Sobrenome (criança -10)', 'child_under_10', 4),
  ('22222222-2222-2222-2222-222222222222', 'Nome Sobrenome (convidado solo)', 'adult', 1);

-- gifts (símbolicos) -------------------------------------------------------
-- suggested_amount_cents são valores de EXEMPLO (múltiplos de R$ 50), fáceis
-- de ajustar depois pelo admin — não são valores reais definidos pelo casal.

insert into gifts (title, description, suggested_amount_cents, sort_order) values
  ('Jantar romântico para os noivos', 'Uma noite especial só para vocês dois.', 15000, 1),
  ('Dia de spa para a noiva', 'Um momento de cuidado e relaxamento.', 20000, 2),
  ('Experiência gastronômica especial', 'Uma refeição memorável para celebrar.', 25000, 3),
  ('Café da manhã dos recém-casados', 'Para as primeiras manhãs juntos.', 10000, 4),
  ('Passeio a dois', 'Um passeio para aproveitar o começo da vida a dois.', 18000, 5),
  ('Cota para a lua de mel', 'Uma contribuição para a viagem dos sonhos.', 30000, 6),
  ('Primeiro domingo da casa nova', 'Para tornar o novo lar ainda mais aconchegante.', 12000, 7),
  ('Uma memória especial para o casal', 'Um mimo simbólico para guardar dessa fase.', 10000, 8);
