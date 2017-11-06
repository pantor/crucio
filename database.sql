-- phpMyAdmin SQL Dump
-- version 4.2.12
-- http://www.phpmyadmin.net
--
-- Host: rdbms
-- Erstellungszeit: 06. Nov 2017 um 22:10
-- Server Version: 5.6.37-log
-- PHP-Version: 5.5.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


--
-- Tabellenstruktur für Tabelle `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
`category_id` int(11) NOT NULL,
  `subject_id` int(10) unsigned NOT NULL,
  `name` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=48 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `collections`
--

CREATE TABLE IF NOT EXISTS `collections` (
`collection_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `data` text COLLATE utf8_unicode_ci NOT NULL,
  `save_date` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=3626 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
`comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `comment` text COLLATE utf8_unicode_ci NOT NULL,
  `date` int(11) NOT NULL,
  `reply_to` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM AUTO_INCREMENT=6473 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `exams`
--

CREATE TABLE IF NOT EXISTS `exams` (
`exam_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `user_id_added` int(11) NOT NULL,
  `date` text COLLATE utf8_unicode_ci NOT NULL,
  `semester` int(11) NOT NULL,
  `professor` text COLLATE utf8_unicode_ci NOT NULL,
  `sort` text COLLATE utf8_unicode_ci NOT NULL,
  `visibility` int(11) NOT NULL,
  `notes` text COLLATE utf8_unicode_ci NOT NULL,
  `duration` int(11) NOT NULL,
  `file_name` text COLLATE utf8_unicode_ci NOT NULL,
  `date_added` int(11) NOT NULL,
  `date_updated` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=598 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
`group_id` int(11) NOT NULL,
  `name` varchar(225) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `oral_exams`
--

CREATE TABLE IF NOT EXISTS `oral_exams` (
`oral_exam_id` int(11) NOT NULL,
  `filename` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `year` int(11) NOT NULL,
  `examiner_count` int(11) NOT NULL,
  `examiner_1` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `examiner_2` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `examiner_3` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `examiner_4` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `semester` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=342 DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `questions`
--

CREATE TABLE IF NOT EXISTS `questions` (
`question_id` int(10) unsigned NOT NULL,
  `exam_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `date_added` int(11) NOT NULL,
  `user_id_added` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `correct_answer` int(11) unsigned NOT NULL DEFAULT '0',
  `question` text COLLATE utf8_unicode_ci NOT NULL,
  `answers` text COLLATE utf8_unicode_ci NOT NULL,
  `explanation` text COLLATE utf8_unicode_ci,
  `question_image_url` text COLLATE utf8_unicode_ci,
  `explanation_image_url` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=11981 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `results`
--

CREATE TABLE IF NOT EXISTS `results` (
`result_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `attempt` int(11) NOT NULL,
  `correct` int(11) NOT NULL,
  `given_result` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  `resetted` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=4000794 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `subjects`
--

CREATE TABLE IF NOT EXISTS `subjects` (
`subject_id` int(11) NOT NULL,
  `name` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=53 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `tags` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE IF NOT EXISTS `users` (
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
) ENGINE=MyISAM AUTO_INCREMENT=2741 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_comments_data`
--

CREATE TABLE IF NOT EXISTS `user_comments_data` (
  `user_id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `user_voting` int(11) NOT NULL DEFAULT '0',
  `subscription` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `whitelist`
--

CREATE TABLE IF NOT EXISTS `whitelist` (
  `mail_address` text COLLATE utf8_unicode_ci NOT NULL,
`mail_id` int(11) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=128 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `categories`
--
ALTER TABLE `categories`
 ADD PRIMARY KEY (`category_id`);

--
-- Indizes für die Tabelle `collections`
--
ALTER TABLE `collections`
 ADD PRIMARY KEY (`collection_id`), ADD KEY `collection_id` (`collection_id`);

--
-- Indizes für die Tabelle `comments`
--
ALTER TABLE `comments`
 ADD PRIMARY KEY (`comment_id`), ADD KEY `id` (`comment_id`);

--
-- Indizes für die Tabelle `exams`
--
ALTER TABLE `exams`
 ADD PRIMARY KEY (`exam_id`);

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
 ADD UNIQUE KEY `question_id_2` (`question_id`), ADD KEY `question_id` (`question_id`), ADD KEY `question_id_3` (`question_id`), ADD KEY `question_id_4` (`question_id`);

--
-- Indizes für die Tabelle `results`
--
ALTER TABLE `results`
 ADD PRIMARY KEY (`result_id`);

--
-- Indizes für die Tabelle `subjects`
--
ALTER TABLE `subjects`
 ADD PRIMARY KEY (`subject_id`);

--
-- Indizes für die Tabelle `tags`
--
ALTER TABLE `tags`
 ADD PRIMARY KEY (`user_id`,`question_id`), ADD UNIQUE KEY `user_id` (`user_id`,`question_id`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`user_id`), ADD UNIQUE KEY `username` (`username`), ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indizes für die Tabelle `user_comments_data`
--
ALTER TABLE `user_comments_data`
 ADD UNIQUE KEY `user_comments_data_unique` (`user_id`,`comment_id`);

--
-- Indizes für die Tabelle `whitelist`
--
ALTER TABLE `whitelist`
 ADD PRIMARY KEY (`mail_id`), ADD FULLTEXT KEY `mail_address` (`mail_address`), ADD FULLTEXT KEY `mail_address_2` (`mail_address`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `categories`
--
ALTER TABLE `categories`
MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT für Tabelle `collections`
--
ALTER TABLE `collections`
MODIFY `collection_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3626;
--
-- AUTO_INCREMENT für Tabelle `comments`
--
ALTER TABLE `comments`
MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6473;
--
-- AUTO_INCREMENT für Tabelle `exams`
--
ALTER TABLE `exams`
MODIFY `exam_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=598;
--
-- AUTO_INCREMENT für Tabelle `groups`
--
ALTER TABLE `groups`
MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT für Tabelle `oral_exams`
--
ALTER TABLE `oral_exams`
MODIFY `oral_exam_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=342;
--
-- AUTO_INCREMENT für Tabelle `questions`
--
ALTER TABLE `questions`
MODIFY `question_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11981;
--
-- AUTO_INCREMENT für Tabelle `results`
--
ALTER TABLE `results`
MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4000794;
--
-- AUTO_INCREMENT für Tabelle `subjects`
--
ALTER TABLE `subjects`
MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=53;
--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2741;
--
-- AUTO_INCREMENT für Tabelle `whitelist`
--
ALTER TABLE `whitelist`
MODIFY `mail_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=128;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
