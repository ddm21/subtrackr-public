-- Create users table
CREATE TABLE public.users (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email text NOT NULL UNIQUE,
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    username text UNIQUE,
    bio text,
    website text,
    location text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text NOT NULL,
    type text NOT NULL,
    website_url text,
    start_date timestamptz DEFAULT now() NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create split_requests table
CREATE TABLE public.split_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id uuid REFERENCES public.subscriptions ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    phone_number text NOT NULL,
    amount numeric(10,2) NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    message text,
    last_reminder_sent timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX users_email_idx ON public.users (email);
CREATE INDEX profiles_username_idx ON public.profiles (username);
CREATE INDEX subscriptions_user_id_idx ON public.subscriptions (user_id);
CREATE INDEX split_requests_subscription_id_idx ON public.split_requests (subscription_id);
CREATE INDEX split_requests_user_id_idx ON public.split_requests (user_id);
CREATE INDEX split_requests_status_idx ON public.split_requests (status);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.split_requests ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Profiles are publicly viewable"
    ON public.profiles FOR SELECT
    TO public;

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
    ON public.subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
    ON public.subscriptions FOR DELETE
    USING (auth.uid() = user_id);

-- Split requests policies
CREATE POLICY "Users can view their own split requests"
    ON public.split_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own split requests"
    ON public.split_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own split requests"
    ON public.split_requests FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own split requests"
    ON public.split_requests FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER split_requests_updated_at
    BEFORE UPDATE ON public.split_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');

    INSERT INTO public.profiles (id)
    VALUES (new.id);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();