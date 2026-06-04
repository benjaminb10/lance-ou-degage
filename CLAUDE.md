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
