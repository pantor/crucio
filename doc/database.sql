-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: database-5005216951.webspace-host.com:3306
-- Erstellungszeit: 25. Okt 2021 um 07:11
-- Server-Version: 5.7.33-log
-- PHP-Version: 7.2.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `DB1581583`
--
CREATE DATABASE IF NOT EXISTS `DB1581583` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `DB1581583`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `subject_id` int(10) UNSIGNED NOT NULL,
  `name` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `comment` text COLLATE utf8_unicode_ci NOT NULL,
  `date` int(11) NOT NULL,
  `reply_to` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `exams`
--

CREATE TABLE `exams` (
  `exam_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `user_id_added` int(11) NOT NULL,
  `date` text COLLATE utf8_unicode_ci,
  `semester` int(11) DEFAULT NULL,
  `professor` text COLLATE utf8_unicode_ci,
  `sort` text COLLATE utf8_unicode_ci NOT NULL,
  `visibility` int(11) NOT NULL DEFAULT '0',
  `notes` text COLLATE utf8_unicode_ci,
  `duration` int(11) DEFAULT NULL,
  `file_name` text COLLATE utf8_unicode_ci,
  `date_added` int(11) NOT NULL,
  `date_updated` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `groups`
--

CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL,
  `name` varchar(225) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `oral_exams`
--

CREATE TABLE `oral_exams` (
  `oral_exam_id` int(11) NOT NULL,
  `filename` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `year` int(11) NOT NULL,
  `examiner_count` int(11) NOT NULL,
  `examiner_1` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `examiner_2` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `examiner_3` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `examiner_4` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `semester` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `questions`
--

CREATE TABLE `questions` (
  `question_id` int(10) UNSIGNED NOT NULL,
  `exam_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `date_added` int(11) NOT NULL,
  `user_id_added` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `correct_answer` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `question` text COLLATE utf8_unicode_ci NOT NULL,
  `answers` text COLLATE utf8_unicode_ci NOT NULL,
  `explanation` text COLLATE utf8_unicode_ci,
  `question_image_url` text COLLATE utf8_unicode_ci,
  `explanation_image_url` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `results`
--

CREATE TABLE `results` (
  `result_id` int(11) NOT NULL,
  `user_id` smallint(6) UNSIGNED NOT NULL,
  `question_id` mediumint(8) UNSIGNED NOT NULL,
  `attempt` tinyint(3) UNSIGNED NOT NULL,
  `given_result` tinyint(4) NOT NULL,
  `date` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `name` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tags`
--

CREATE TABLE `tags` (
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `tags` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `username_clean` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(225) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `activationtoken` varchar(225) COLLATE utf8_unicode_ci NOT NULL,
  `last_activation_request` int(11) NOT NULL,
  `LostpasswordRequest` int(1) NOT NULL DEFAULT '0',
  `active` int(1) NOT NULL DEFAULT '0',
  `group_id` int(11) NOT NULL DEFAULT '1',
  `sign_up_date` int(11) NOT NULL,
  `last_sign_in` int(11) NOT NULL DEFAULT '0',
  `semester` int(10) NOT NULL,
  `course_id` int(11) NOT NULL,
  `highlightExams` tinyint(1) NOT NULL DEFAULT '1',
  `showComments` tinyint(1) NOT NULL DEFAULT '1',
  `repetitionValue` int(11) NOT NULL DEFAULT '50',
  `forgetValue` int(11) NOT NULL DEFAULT '50',
  `useAnswers` tinyint(1) NOT NULL DEFAULT '1',
  `useTags` tinyint(1) NOT NULL DEFAULT '1',
  `active_2` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_comments_data`
--

CREATE TABLE `user_comments_data` (
  `user_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `user_voting` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `whitelist`
--

CREATE TABLE `whitelist` (
  `mail_address` text COLLATE utf8_unicode_ci NOT NULL,
  `mail_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indizes für die Tabelle `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indizes für die Tabelle `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`exam_id`),
  ADD KEY `exam_search` (`semester`,`subject_id`,`visibility`) USING BTREE,
  ADD KEY `subject_id` (`subject_id`);

--
-- Indizes für die Tabelle `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`);

--
-- Indizes für die Tabelle `oral_exams`
--
ALTER TABLE `oral_exams`
  ADD PRIMARY KEY (`oral_exam_id`);

--
-- Indizes für die Tabelle `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`) USING BTREE,
  ADD KEY `exam_id` (`exam_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indizes für die Tabelle `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `user_true` (`user_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indizes für die Tabelle `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indizes für die Tabelle `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`user_id`,`question_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`question_id`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indizes für die Tabelle `user_comments_data`
--
ALTER TABLE `user_comments_data`
  ADD UNIQUE KEY `user_id` (`user_id`,`comment_id`),
  ADD KEY `comment_id` (`comment_id`);

--
-- Indizes für die Tabelle `whitelist`
--
ALTER TABLE `whitelist`
  ADD PRIMARY KEY (`mail_id`);
ALTER TABLE `whitelist` ADD FULLTEXT KEY `mail_address` (`mail_address`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `exams`
--
ALTER TABLE `exams`
  MODIFY `exam_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `groups`
--
ALTER TABLE `groups`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `oral_exams`
--
ALTER TABLE `oral_exams`
  MODIFY `oral_exam_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `results`
--
ALTER TABLE `results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `whitelist`
--
ALTER TABLE `whitelist`
  MODIFY `mail_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
