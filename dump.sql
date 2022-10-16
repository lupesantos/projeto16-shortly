--
-- PostgreSQL database dump
--

-- Dumped from database version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    "fullName" text NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.links (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    url text NOT NULL,
    "shortUrl" text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.links_id_seq OWNED BY public.links.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    token text NOT NULL
);


--
-- Name: session_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.session_id_seq OWNED BY public.session.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visits (
    id integer NOT NULL,
    "urlId" integer NOT NULL
);


--
-- Name: visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.visits_id_seq OWNED BY public.visits.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links ALTER COLUMN id SET DEFAULT nextval('public.links_id_seq'::regclass);


--
-- Name: session id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session ALTER COLUMN id SET DEFAULT nextval('public.session_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits ALTER COLUMN id SET DEFAULT nextval('public.visits_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories VALUES (1, 'luciano');
INSERT INTO public.categories VALUES (2, 'luciano');


--
-- Data for Name: links; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.links VALUES (1, 11, 'https://bootcampra.notion.site/Materiais-038b870362b744d88c047f4e4e8beb46', 'ZYhC3Bu6HLyqMd4Q4TuUz', '2022-10-13 09:42:34.729953');
INSERT INTO public.links VALUES (2, 11, 'https://www.google.com.br/', 'gWarvi3j9t0RHLefmk_ft', '2022-10-13 10:15:23.008706');
INSERT INTO public.links VALUES (3, 4, 'https://www.google.com.br/', '1AVjEP8D4X8s-QCMTC6Ta', '2022-10-13 11:25:18.394205');


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.session VALUES (1, 11, '5a869e34-a874-46dd-940f-3898cbdbcb55');
INSERT INTO public.session VALUES (2, 4, 'ad8c5fcc-6ec1-4a59-abb3-e88a501889f8');
INSERT INTO public.session VALUES (3, 1, '13bdd542-7d88-436d-9364-94d4c3f5edb0');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'João', 'joao@driven.com.br', '$2b$10$GuVTim/BdLD06YvTaow82eyIaK4JXWx9UdAStu3YIggZ8dk/uSmYy');
INSERT INTO public.users VALUES (2, '', 'darklps@gmail.com', '$2b$10$iirUQ9XvaPcyCdr2h4J7Je8jk2YMrWVcvimN0HxKEB89OoI0zXa16');
INSERT INTO public.users VALUES (4, 'karina', 'karinao@gmail.com', '$2b$10$T0fd4sg11PhlV1jGqwo5vOVNKpuB6X2C5fL2k4pd7k9k8Y.cIbeqG');
INSERT INTO public.users VALUES (5, 'karina2', 'karinao2@gmail.com', '$2b$10$ytGo9W37q8WygqYXmGQ6OOKQA/Rg4Nf7iidlJ0xhRCFnBZimdfwC2');
INSERT INTO public.users VALUES (7, 'karina2', 'karinao3@gmail.com', '$2b$10$9kh5HuJFLKpuFgi.ETwfce6/VXp3a6fiNrAwj3NE6xQRjBhjZs7B6');
INSERT INTO public.users VALUES (8, 'karina2', 'karinao4@gmail.com', '$2b$10$bVAJ3MMzzlDF4Lz6Myw9aOToOaW0S9pSUMWw3tpBj9iU7tP44KuMS');
INSERT INTO public.users VALUES (9, 'karina2', 'karinao6@gmail.com', '$2b$10$yU6bmAtRMys.b8K14vNt6eOL6G5wc8K6CINb5GMLOoJijH7g4HhUy');
INSERT INTO public.users VALUES (11, 'karina2', 'karinao7@gmail.com', '$2b$10$zOgAWjwUZHlhw2EqhWpyb.66MoyvdsiJEIPvIwmJRNsUtbzTjMQOS');


--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.visits VALUES (1, 2);
INSERT INTO public.visits VALUES (2, 1);
INSERT INTO public.visits VALUES (3, 1);
INSERT INTO public.visits VALUES (4, 1);
INSERT INTO public.visits VALUES (5, 2);
INSERT INTO public.visits VALUES (6, 2);
INSERT INTO public.visits VALUES (7, 2);
INSERT INTO public.visits VALUES (8, 3);
INSERT INTO public.visits VALUES (9, 3);
INSERT INTO public.visits VALUES (10, 3);
INSERT INTO public.visits VALUES (11, 3);
INSERT INTO public.visits VALUES (12, 3);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 9, true);


--
-- Name: links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.links_id_seq', 5, true);


--
-- Name: session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.session_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.visits_id_seq', 18, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: links links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


--
-- Name: links links_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT "links_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: visits visits_urlId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT "visits_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES public.links(id);


--
-- PostgreSQL database dump complete
--

