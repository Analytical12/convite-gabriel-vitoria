-- V2.1: first-class free contribution and payment reconciliation metadata.

alter table gifts
  add column gift_type text not null default 'suggested'
  check (gift_type in ('suggested', 'free'));

create unique index gifts_single_free_contribution_idx
  on gifts (gift_type)
  where gift_type = 'free';

insert into gifts (
  id,
  title,
  description,
  suggested_amount_cents,
  allow_custom_amount,
  is_active,
  sort_order,
  gift_type
)
select
  '00000000-0000-4000-8000-000000000021',
  'Contribuir com valor livre',
  'Escolha o valor que fizer sentido para você.',
  1000,
  true,
  true,
  999,
  'free'
where not exists (select 1 from gifts where gift_type = 'free');

alter table gift_contributions
  add column provider_status_detail text,
  add column provider_live_mode boolean,
  add column provider_currency text;

create unique index gift_contributions_provider_payment_id_unique_idx
  on gift_contributions (provider_payment_id)
  where provider_payment_id is not null;
