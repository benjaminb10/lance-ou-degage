# Lance ou Dégage

Site communautaire pour makers qui lancent un produit en 30 jours.

## Stack

- **Frontend**: React + TanStack Router + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (auth + database)
- **Payments**: Stripe Payment Links
- **Hosting**: Vercel

## Structure

```
app/
├── routes/          # Pages (TanStack Router file-based routing)
│   ├── index.tsx    # Landing page
│   ├── onboarding.tsx # Post-payment onboarding form
│   └── admin.tsx    # Admin dashboard (auth required)
├── components/      # React components
│   ├── landing/     # Landing page components
│   └── ui/          # Reusable UI components
└── lib/
    └── supabase.ts  # Supabase client + types
```

## Database (Supabase)

Tables:
- `members` - Membres de la communauté
- `projects` - Projets des membres

## Admin

- Email: `benoudis.benjamin@gmail.com`
- Auth via Supabase Auth + RLS policies
- Accès: `/admin`

## Credentials

Les credentials sont dans `.claude-secrets` (gitignored).

## Instructions pour Claude

- **NE PAS commit/push automatiquement** : Toujours demander avant de commit et push
- **Mode plan** : Quand le mode plan est actif, présenter le plan et attendre validation AVANT d'implémenter
- **Demander confirmation** : Pour les changements significatifs, demander si le résultat convient avant de passer à la suite

## Opérations courantes

### Changer les prix

1. **Créer un nouveau prix Stripe** (via MCP) :
   ```
   mcp__stripe__create_price(product: "prod_Ud5TCiGeOU4cbk", unit_amount: 4900, currency: "eur")
   ```

2. **Créer un nouveau Payment Link** (via MCP) :
   ```
   mcp__stripe__create_payment_link(price: "price_xxx", quantity: 1)
   ```

3. **Configurer le Payment Link** (redirect + codes promo) :
   ```
   mcp__stripe__stripe_api_execute(
     stripe_api_operation_id: "PostPaymentLinksPaymentLink",
     parameters: {
       "payment_link": "plink_xxx",
       "after_completion[type]": "redirect",
       "after_completion[redirect][url]": "https://lance-ou-degage.fr/onboarding?session_id={CHECKOUT_SESSION_ID}",
       "allow_promotion_codes": true
     }
   )
   ```

4. **Mettre à jour `app/components/landing/Pricing.tsx`** :
   - `currentPrice` : prix actuel
   - `originalPrice` : prix barré (optionnel)
   - `currentRemaining` : places restantes
   - `nextTiers` : prochains paliers
   - Lien Stripe dans le `<a href="...">`

### Base de données (psql)

Credentials dans `.claude-secrets`. Exemple :
```bash
PGPASSWORD='xxx' psql -h db.bzutwrszmrmfzfxbmyeu.supabase.co -p 5432 -U postgres -d postgres -c "SQL"
```

**Opérations fréquentes :**
- Ajouter un projet : `INSERT INTO projects (member_id, name, url) VALUES ('uuid', 'Nom', 'https://...');`
- Modifier un projet : `UPDATE projects SET url = 'https://...' WHERE member_id = 'uuid';`
- Lancer le compteur 30j : `UPDATE members SET countdown_started_at = NOW() WHERE id = 'uuid';`

### RLS / Permissions Supabase

**IMPORTANT : Checklist pour chaque nouvelle table ou opération**

Quand on crée une nouvelle table ou qu'on veut permettre une nouvelle opération (INSERT, UPDATE, DELETE) :

#### 1. Activer RLS sur la table
```sql
ALTER TABLE ma_table ENABLE ROW LEVEL SECURITY;
```

#### 2. Créer les politiques RLS (qui peut faire quoi)
```sql
-- SELECT : qui peut lire
CREATE POLICY "Anyone can view" ON ma_table FOR SELECT USING (true);

-- INSERT : qui peut insérer
CREATE POLICY "Members can insert own" ON ma_table FOR INSERT
WITH CHECK (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));

-- UPDATE : qui peut modifier (USING = quelles lignes, WITH CHECK = nouvelles valeurs)
CREATE POLICY "Members can update own" ON ma_table FOR UPDATE
USING (true)
WITH CHECK (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));

-- DELETE : qui peut supprimer
CREATE POLICY "Members can delete own" ON ma_table FOR DELETE
USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
```

#### 3. Accorder les GRANT (permissions bas niveau)
```sql
-- Sans ça, même avec RLS ok, l'opération échoue avec "permission denied"
GRANT SELECT ON ma_table TO anon, authenticated;
GRANT INSERT ON ma_table TO authenticated;
GRANT UPDATE ON ma_table TO authenticated;
GRANT DELETE ON ma_table TO authenticated;
```

**Erreurs courantes :**
- `403 Forbidden` = politique RLS manquante ou incorrecte
- `permission denied for table xxx` = GRANT manquant

**Tables actuelles et leurs permissions :**
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| members | anon, auth | anon, auth | auth | - |
| projects | anon, auth | anon, auth | auth | auth |
| updates | anon, auth | auth | auth | - |
| achievements | anon, auth | - | - | - |
| member_achievements | anon, auth | auth | - | auth |

### Routes

- `/` : Landing page
- `/leaderboard` : Classement public
- `/membre/$id` : Profil public avec countdown 30 jours
- `/onboarding?session_id=xxx` : Formulaire post-paiement
- `/admin` : Dashboard admin (auth Supabase)
