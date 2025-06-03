-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2025 at 09:40 AM
-- Server version: 8.0.40
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendance_monitoring`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` bigint NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(127) COLLATE utf8mb4_general_ci NOT NULL,
  `contact_number` varchar(15) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `email`, `password`, `contact_number`) VALUES
(1, 'admin@ustp.cdo', 'admin', '0917 823 5461'),
(2, 'kween@ustp.cdo', 'kweens', '0995 274 1386');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` bigint NOT NULL,
  `student_details_id` bigint NOT NULL,
  `date` date NOT NULL,
  `time_in` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `time_out` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Present','Absent','Late','Excused') COLLATE utf8mb4_general_ci NOT NULL,
  `is_locked` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attendance_id`, `student_details_id`, `date`, `time_in`, `time_out`, `status`, `is_locked`) VALUES
(88, 125, '2025-06-03', '2025-05-31 17:54:18', '2025-05-31 17:54:18', 'Present', 0),
(89, 120, '2025-06-03', '2025-05-31 17:54:30', '2025-05-31 17:54:30', 'Present', 0),
(90, 130, '2025-06-03', '2025-05-31 17:54:30', '2025-05-31 17:54:30', 'Present', 0),
(91, 134, '2025-06-03', '2025-05-31 17:54:30', '2025-05-31 17:54:30', 'Present', 0),
(92, 139, '2025-06-03', '2025-05-31 17:54:30', '2025-05-31 17:54:30', 'Late', 0),
(93, 144, '2025-06-03', '2025-05-31 17:54:30', '2025-05-31 17:54:30', 'Present', 0),
(94, 149, '2025-06-03', '2025-05-31 17:54:30', '2025-05-31 17:54:30', 'Present', 0),
(95, 154, '2025-06-03', '2025-05-31 17:54:30', '2025-05-31 17:54:30', 'Present', 0),
(96, 160, '2025-06-03', '2025-05-31 17:54:30', '2025-05-31 17:54:30', 'Present', 0),
(97, 164, '2025-06-03', '2025-05-31 17:54:30', '2025-05-31 17:54:30', 'Present', 0),
(98, 169, '2025-06-03', '2025-05-31 17:54:30', '2025-05-31 17:54:30', 'Present', 0),
(99, 186, '2025-06-03', '2025-05-31 18:03:04', '2025-05-31 18:03:04', 'Present', 0),
(100, 192, '2025-06-03', '2025-05-31 18:03:05', '2025-05-31 18:03:05', 'Present', 0),
(101, 180, '2025-06-03', '2025-05-31 18:03:05', '2025-05-31 18:03:05', 'Present', 0),
(102, 198, '2025-06-03', '2025-05-31 18:03:06', '2025-05-31 18:03:06', 'Present', 0),
(103, 174, '2025-06-03', '2025-05-31 18:03:07', '2025-05-31 18:03:07', 'Present', 0),
(104, 204, '2025-06-03', '2025-05-31 18:12:42', '2025-05-31 18:12:42', 'Present', 0),
(105, 210, '2025-06-03', '2025-05-31 18:12:42', '2025-05-31 18:12:42', 'Absent', 0),
(106, 245, '2025-06-03', '2025-06-01 07:50:50', '2025-06-01 07:50:50', 'Absent', 0),
(107, 237, '2025-06-03', '2025-06-01 07:50:54', '2025-06-01 07:50:54', 'Absent', 0),
(108, 248, '2025-06-03', '2025-06-01 07:50:58', '2025-06-01 07:50:58', 'Absent', 0),
(109, 225, '2025-06-03', '2025-06-01 07:51:01', '2025-06-01 07:51:01', 'Absent', 0),
(110, 221, '2025-06-03', '2025-06-01 07:51:02', '2025-06-01 07:51:02', 'Absent', 0),
(111, 256, '2025-06-03', '2025-06-01 07:51:03', '2025-06-01 07:51:03', 'Absent', 0),
(112, 229, '2025-06-03', '2025-06-01 07:51:09', '2025-06-01 07:51:09', 'Absent', 0),
(113, 252, '2025-06-03', '2025-06-01 07:51:12', '2025-06-01 07:51:12', 'Absent', 0),
(114, 241, '2025-06-03', '2025-06-01 07:51:15', '2025-06-01 07:51:15', 'Absent', 0),
(115, 233, '2025-06-03', '2025-06-01 07:51:15', '2025-06-01 07:51:15', 'Absent', 0),
(116, 217, '2025-06-03', '2025-06-01 07:51:21', '2025-06-01 07:51:21', 'Absent', 0),
(117, 213, '2025-06-03', '2025-06-01 07:51:33', '2025-06-01 07:51:33', 'Absent', 0),
(118, 216, '2025-06-02', '2025-06-01 08:04:55', '2025-06-01 08:04:55', 'Present', 1),
(119, 251, '2025-06-02', '2025-06-01 08:05:05', '2025-06-01 08:05:05', 'Present', 1),
(120, 220, '2025-06-02', '2025-06-01 08:05:53', '2025-06-01 08:05:53', 'Absent', 1),
(121, 224, '2025-06-02', '2025-06-01 08:05:53', '2025-06-01 08:05:53', 'Absent', 1),
(122, 228, '2025-06-02', '2025-06-01 08:05:53', '2025-06-01 08:05:53', 'Absent', 1),
(123, 232, '2025-06-02', '2025-06-01 08:05:53', '2025-06-01 08:05:53', 'Absent', 1),
(124, 236, '2025-06-02', '2025-06-01 08:05:53', '2025-06-01 08:05:53', 'Absent', 1),
(125, 240, '2025-06-02', '2025-06-01 08:05:53', '2025-06-01 08:05:53', 'Absent', 1),
(126, 244, '2025-06-02', '2025-06-01 08:05:53', '2025-06-01 08:05:53', 'Absent', 1),
(127, 255, '2025-06-02', '2025-06-01 08:05:53', '2025-06-01 08:05:53', 'Absent', 1),
(128, 259, '2025-06-02', '2025-06-01 08:05:53', '2025-06-01 08:05:53', 'Absent', 1),
(129, 356, '2025-06-03', '2025-06-01 09:17:38', '2025-06-01 09:17:38', 'Present', 1),
(130, 290, '2025-06-03', '2025-06-01 09:17:39', '2025-06-01 09:17:39', 'Present', 1),
(131, 425, '2025-06-03', '2025-06-01 09:17:39', '2025-06-01 09:17:39', 'Present', 1),
(132, 306, '2025-06-03', '2025-06-01 09:17:39', '2025-06-01 09:17:39', 'Present', 1),
(133, 420, '2025-06-03', '2025-06-01 09:17:40', '2025-06-01 09:17:40', 'Present', 1),
(134, 330, '2025-06-03', '2025-06-01 09:17:40', '2025-06-01 09:17:40', 'Present', 1),
(135, 460, '2025-06-03', '2025-06-01 09:17:41', '2025-06-01 09:17:41', 'Present', 1),
(136, 385, '2025-06-03', '2025-06-01 09:17:41', '2025-06-01 09:17:41', 'Present', 1),
(137, 340, '2025-06-03', '2025-06-01 09:17:41', '2025-06-01 09:17:41', 'Present', 1),
(138, 470, '2025-06-03', '2025-06-01 09:17:42', '2025-06-01 09:17:42', 'Present', 1),
(139, 285, '2025-06-03', '2025-06-01 09:17:42', '2025-06-01 09:17:42', 'Present', 1),
(140, 315, '2025-06-03', '2025-06-01 09:17:42', '2025-06-01 09:17:42', 'Present', 1),
(141, 415, '2025-06-03', '2025-06-01 09:17:42', '2025-06-01 09:17:42', 'Present', 1),
(142, 445, '2025-06-03', '2025-06-01 09:17:43', '2025-06-01 09:17:43', 'Present', 1),
(143, 310, '2025-06-03', '2025-06-01 09:17:43', '2025-06-01 09:17:43', 'Present', 1),
(144, 440, '2025-06-03', '2025-06-01 09:17:43', '2025-06-01 09:17:43', 'Present', 1),
(145, 280, '2025-06-03', '2025-06-01 09:17:44', '2025-06-01 09:17:44', 'Present', 1),
(146, 360, '2025-06-03', '2025-06-01 09:17:44', '2025-06-01 09:17:44', 'Present', 1),
(147, 390, '2025-06-03', '2025-06-01 09:17:45', '2025-06-01 09:17:45', 'Present', 1),
(148, 320, '2025-06-03', '2025-06-01 09:17:46', '2025-06-01 09:17:46', 'Present', 1),
(149, 260, '2025-06-03', '2025-06-01 09:17:46', '2025-06-01 09:17:46', 'Present', 1),
(150, 345, '2025-06-03', '2025-06-01 09:17:46', '2025-06-01 09:17:46', 'Present', 1),
(151, 400, '2025-06-03', '2025-06-01 09:17:46', '2025-06-01 09:17:46', 'Present', 1),
(152, 300, '2025-06-03', '2025-06-01 09:17:47', '2025-06-01 09:17:47', 'Present', 1),
(153, 430, '2025-06-03', '2025-06-01 09:17:48', '2025-06-01 09:17:48', 'Present', 1),
(154, 295, '2025-06-03', '2025-06-01 09:17:48', '2025-06-01 09:17:48', 'Present', 1),
(155, 335, '2025-06-03', '2025-06-01 09:17:49', '2025-06-01 09:17:49', 'Present', 1),
(156, 275, '2025-06-03', '2025-06-01 09:17:49', '2025-06-01 09:17:49', 'Present', 1),
(157, 375, '2025-06-03', '2025-06-01 09:17:50', '2025-06-01 09:17:50', 'Present', 1),
(158, 405, '2025-06-03', '2025-06-01 09:17:51', '2025-06-01 09:17:51', 'Present', 1),
(159, 410, '2025-06-03', '2025-06-01 09:17:54', '2025-06-01 09:17:54', 'Present', 1),
(160, 365, '2025-06-03', '2025-06-01 09:17:54', '2025-06-01 09:17:54', 'Present', 1),
(161, 371, '2025-06-03', '2025-06-01 09:17:54', '2025-06-01 09:17:54', 'Present', 1),
(162, 325, '2025-06-03', '2025-06-01 09:17:54', '2025-06-01 09:17:54', 'Present', 1),
(163, 435, '2025-06-03', '2025-06-01 09:17:55', '2025-06-01 09:17:55', 'Present', 1),
(164, 350, '2025-06-03', '2025-06-01 09:17:55', '2025-06-01 09:17:55', 'Present', 1),
(165, 265, '2025-06-03', '2025-06-01 09:17:56', '2025-06-01 09:17:56', 'Present', 1),
(166, 465, '2025-06-03', '2025-06-01 09:17:56', '2025-06-01 09:17:56', 'Present', 1),
(167, 455, '2025-06-03', '2025-06-01 09:17:57', '2025-06-01 09:17:57', 'Present', 1),
(168, 450, '2025-06-03', '2025-06-01 09:17:57', '2025-06-01 09:17:57', 'Present', 1),
(169, 270, '2025-06-03', '2025-06-01 09:17:57', '2025-06-01 09:17:57', 'Present', 1),
(170, 380, '2025-06-03', '2025-06-01 09:17:57', '2025-06-01 09:17:57', 'Present', 1),
(171, 395, '2025-06-03', '2025-06-01 09:17:59', '2025-06-01 09:17:59', 'Present', 1),
(172, 502, '2025-06-03', '2025-06-01 14:11:19', '2025-06-01 14:11:19', 'Absent', 0),
(173, 491, '2025-06-03', '2025-06-01 14:11:21', '2025-06-01 14:11:21', 'Absent', 0),
(174, 494, '2025-06-03', '2025-06-01 14:11:33', '2025-06-01 14:11:33', 'Absent', 0),
(175, 498, '2025-06-03', '2025-06-01 14:11:39', '2025-06-01 14:11:39', 'Absent', 0),
(176, 149, '2025-06-02', '2025-06-02 03:04:58', '2025-06-02 03:04:58', 'Present', 0),
(177, 130, '2025-06-02', '2025-06-02 03:04:58', '2025-06-02 03:04:58', 'Present', 0),
(178, 210, '2025-06-02', '2025-06-02 03:04:58', '2025-06-02 03:04:58', 'Excused', 0),
(179, 154, '2025-06-02', '2025-06-02 03:04:58', '2025-06-02 03:04:58', 'Late', 0),
(180, 125, '2025-06-02', '2025-06-02 03:04:59', '2025-06-02 03:04:59', 'Present', 0),
(181, 144, '2025-06-02', '2025-06-02 03:04:59', '2025-06-02 03:04:59', 'Present', 0),
(182, 149, '2025-05-26', '2025-06-02 03:05:06', '2025-06-02 03:05:06', 'Present', 1),
(183, 130, '2025-05-26', '2025-06-02 03:05:06', '2025-06-02 03:05:06', 'Present', 1),
(184, 210, '2025-05-26', '2025-06-02 03:05:06', '2025-06-02 03:05:06', 'Present', 1),
(185, 154, '2025-05-26', '2025-06-02 03:05:06', '2025-06-02 03:05:06', 'Present', 1),
(186, 144, '2025-05-26', '2025-06-02 03:05:07', '2025-06-02 03:05:07', 'Present', 1),
(187, 125, '2025-05-26', '2025-06-02 03:05:08', '2025-06-02 03:05:08', 'Present', 1),
(188, 139, '2025-05-26', '2025-06-02 03:05:08', '2025-06-02 03:05:08', 'Present', 1),
(189, 160, '2025-05-26', '2025-06-02 03:05:08', '2025-06-02 03:05:08', 'Present', 1),
(190, 192, '2025-05-26', '2025-06-02 03:05:08', '2025-06-02 03:05:08', 'Present', 1),
(191, 120, '2025-05-26', '2025-06-02 03:05:09', '2025-06-02 03:05:09', 'Present', 1),
(192, 180, '2025-05-26', '2025-06-02 03:05:09', '2025-06-02 03:05:09', 'Present', 1),
(193, 186, '2025-05-26', '2025-06-02 03:05:10', '2025-06-02 03:05:10', 'Present', 1),
(194, 198, '2025-05-26', '2025-06-02 03:05:10', '2025-06-02 03:05:10', 'Present', 1),
(195, 169, '2025-05-26', '2025-06-02 03:05:11', '2025-06-02 03:05:11', 'Present', 1),
(196, 164, '2025-05-26', '2025-06-02 03:05:11', '2025-06-02 03:05:11', 'Present', 1),
(197, 174, '2025-05-26', '2025-06-02 03:05:12', '2025-06-02 03:05:12', 'Present', 1),
(198, 134, '2025-05-26', '2025-06-02 03:05:14', '2025-06-02 03:05:14', 'Absent', 1),
(199, 204, '2025-05-26', '2025-06-02 03:05:14', '2025-06-02 03:05:14', 'Absent', 1),
(200, 120, '2025-05-19', '2025-06-02 03:05:20', '2025-06-02 03:05:20', 'Present', 0),
(201, 125, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(202, 130, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(203, 134, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(204, 139, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(205, 144, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(206, 149, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(207, 154, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(208, 160, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(209, 164, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(210, 169, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(211, 174, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(212, 180, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(213, 186, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(214, 192, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(215, 198, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(216, 204, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(217, 210, '2025-05-19', '2025-06-02 03:05:22', '2025-06-02 03:05:22', 'Absent', 0),
(218, 120, '2025-05-12', '2025-06-02 03:05:26', '2025-06-02 03:05:26', 'Present', 0),
(219, 125, '2025-05-12', '2025-06-02 03:05:27', '2025-06-02 03:05:27', 'Absent', 0),
(220, 130, '2025-05-12', '2025-06-02 03:05:27', '2025-06-02 03:05:27', 'Absent', 0),
(221, 134, '2025-05-12', '2025-06-02 03:05:27', '2025-06-02 03:05:27', 'Absent', 0),
(222, 139, '2025-05-12', '2025-06-02 03:05:27', '2025-06-02 03:05:27', 'Absent', 0),
(223, 144, '2025-05-12', '2025-06-02 03:05:27', '2025-06-02 03:05:27', 'Absent', 0),
(224, 149, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(225, 154, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(226, 160, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(227, 164, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(228, 169, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(229, 174, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(230, 180, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(231, 186, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(232, 192, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(233, 198, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(234, 204, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(235, 210, '2025-05-12', '2025-06-02 03:05:28', '2025-06-02 03:05:28', 'Absent', 0),
(236, 120, '2025-05-05', '2025-06-02 03:05:44', '2025-06-02 03:05:44', 'Present', 0),
(237, 120, '2025-05-06', '2025-06-02 03:05:47', '2025-06-02 03:05:47', 'Present', 0),
(238, 120, '2025-05-13', '2025-06-02 03:05:51', '2025-06-02 03:05:51', 'Late', 0),
(239, 120, '2025-05-20', '2025-06-02 03:05:54', '2025-06-02 03:05:54', 'Absent', 0),
(240, 120, '2025-05-27', '2025-06-02 03:05:58', '2025-06-02 03:05:58', 'Present', 0),
(241, 120, '2025-04-07', '2025-06-02 03:06:03', '2025-06-02 03:06:03', 'Present', 0),
(242, 120, '2025-04-08', '2025-06-02 03:06:06', '2025-06-02 03:06:06', 'Present', 0),
(243, 120, '2025-04-14', '2025-06-02 03:06:09', '2025-06-02 03:06:09', 'Present', 0),
(244, 120, '2025-04-21', '2025-06-02 03:06:13', '2025-06-02 03:06:13', 'Late', 0),
(245, 120, '2025-04-22', '2025-06-02 03:06:16', '2025-06-02 03:06:16', 'Present', 0),
(246, 120, '2025-04-15', '2025-06-02 03:06:19', '2025-06-02 03:06:19', 'Present', 0),
(247, 120, '2025-04-28', '2025-06-02 03:06:22', '2025-06-02 03:06:22', 'Present', 0),
(248, 120, '2025-04-29', '2025-06-02 03:06:25', '2025-06-02 03:06:25', 'Present', 0),
(250, 121, '2025-05-29', '2025-06-02 03:09:10', '2025-06-02 03:09:10', 'Present', 0),
(251, 121, '2025-05-31', '2025-06-02 03:09:14', '2025-06-02 03:09:14', 'Present', 0),
(252, 121, '2025-05-22', '2025-06-02 03:09:17', '2025-06-02 03:09:17', 'Late', 0),
(253, 121, '2025-05-24', '2025-06-02 03:09:21', '2025-06-02 03:09:21', 'Present', 0),
(254, 121, '2025-05-15', '2025-06-02 03:09:25', '2025-06-02 03:09:25', 'Present', 0),
(255, 121, '2025-05-17', '2025-06-02 03:09:29', '2025-06-02 03:09:29', 'Late', 0),
(256, 121, '2025-05-08', '2025-06-02 03:09:32', '2025-06-02 03:09:32', 'Present', 0),
(257, 121, '2025-05-10', '2025-06-02 03:09:37', '2025-06-02 03:09:37', 'Present', 0),
(258, 121, '2025-05-01', '2025-06-02 03:10:24', '2025-06-02 03:10:24', 'Present', 0),
(259, 121, '2025-05-03', '2025-06-02 03:10:26', '2025-06-02 03:10:26', 'Present', 0),
(260, 121, '2025-04-24', '2025-06-02 03:10:31', '2025-06-02 03:10:31', 'Present', 0),
(261, 121, '2025-04-26', '2025-06-02 03:10:33', '2025-06-02 03:10:33', 'Late', 0),
(262, 121, '2025-04-17', '2025-06-02 03:10:34', '2025-06-02 03:10:34', 'Present', 0),
(263, 121, '2025-04-10', '2025-06-02 03:10:35', '2025-06-02 03:10:35', 'Present', 0),
(264, 121, '2025-04-19', '2025-06-02 03:10:37', '2025-06-02 03:10:37', 'Late', 0),
(265, 121, '2025-04-12', '2025-06-02 03:10:41', '2025-06-02 03:10:41', 'Absent', 0),
(266, 121, '2025-04-05', '2025-06-02 03:10:44', '2025-06-02 03:10:44', 'Present', 0),
(267, 121, '2025-04-03', '2025-06-02 03:10:45', '2025-06-02 03:10:45', 'Present', 0),
(268, 118, '2025-05-29', '2025-06-02 03:12:40', '2025-06-02 03:12:40', 'Present', 0),
(269, 118, '2025-05-30', '2025-06-02 03:12:42', '2025-06-02 03:12:42', 'Present', 0),
(270, 118, '2025-05-23', '2025-06-02 03:12:44', '2025-06-02 03:12:44', 'Late', 0),
(271, 118, '2025-05-22', '2025-06-02 03:12:46', '2025-06-02 03:12:46', 'Present', 0),
(272, 118, '2025-05-15', '2025-06-02 03:12:48', '2025-06-02 03:12:48', 'Present', 0),
(273, 118, '2025-05-16', '2025-06-02 03:12:49', '2025-06-02 03:12:49', 'Late', 0),
(274, 118, '2025-05-08', '2025-06-02 03:12:51', '2025-06-02 03:12:51', 'Present', 0),
(275, 118, '2025-05-09', '2025-06-02 03:12:53', '2025-06-02 03:12:53', 'Present', 0),
(276, 118, '2025-05-01', '2025-06-02 03:12:55', '2025-06-02 03:12:55', 'Present', 0),
(277, 118, '2025-05-02', '2025-06-02 03:12:56', '2025-06-02 03:12:56', 'Present', 0),
(278, 118, '2025-04-25', '2025-06-02 03:12:59', '2025-06-02 03:12:59', 'Present', 0),
(279, 178, '2025-04-24', '2025-06-02 03:13:00', '2025-06-02 03:13:00', 'Absent', 0),
(280, 118, '2025-04-24', '2025-06-02 03:13:01', '2025-06-02 03:13:01', 'Late', 0),
(281, 118, '2025-04-17', '2025-06-02 03:13:03', '2025-06-02 03:13:03', 'Absent', 0),
(282, 118, '2025-04-18', '2025-06-02 03:13:05', '2025-06-02 03:13:05', 'Present', 0),
(283, 118, '2025-04-10', '2025-06-02 03:13:07', '2025-06-02 03:13:07', 'Present', 0),
(284, 118, '2025-04-11', '2025-06-02 03:13:08', '2025-06-02 03:13:08', 'Present', 0),
(285, 118, '2025-04-03', '2025-06-02 03:13:11', '2025-06-02 03:13:11', 'Present', 0),
(286, 118, '2025-04-04', '2025-06-02 03:13:12', '2025-06-02 03:13:12', 'Present', 0),
(287, 117, '2025-05-26', '2025-06-02 03:15:40', '2025-06-02 03:15:40', 'Excused', 0),
(288, 117, '2025-05-27', '2025-06-02 03:15:50', '2025-06-02 03:15:50', 'Present', 0),
(289, 117, '2025-05-19', '2025-06-02 03:15:52', '2025-06-02 03:15:52', 'Present', 0),
(290, 117, '2025-05-20', '2025-06-02 03:15:54', '2025-06-02 03:15:54', 'Present', 0),
(291, 117, '2025-05-12', '2025-06-02 03:15:56', '2025-06-02 03:15:56', 'Present', 0),
(292, 117, '2025-05-13', '2025-06-02 03:15:58', '2025-06-02 03:15:58', 'Late', 0),
(293, 117, '2025-05-05', '2025-06-02 03:16:03', '2025-06-02 03:16:03', 'Present', 0),
(294, 117, '2025-05-06', '2025-06-02 03:16:04', '2025-06-02 03:16:04', 'Present', 0),
(295, 117, '2025-04-29', '2025-06-02 03:16:06', '2025-06-02 03:16:06', 'Present', 0),
(296, 117, '2025-04-28', '2025-06-02 03:16:08', '2025-06-02 03:16:08', 'Present', 0),
(297, 117, '2025-04-21', '2025-06-02 03:16:09', '2025-06-02 03:16:09', 'Present', 0),
(298, 117, '2025-04-22', '2025-06-02 03:16:11', '2025-06-02 03:16:11', 'Late', 0),
(299, 177, '2025-04-14', '2025-06-02 03:16:13', '2025-06-02 03:16:13', 'Absent', 0),
(300, 117, '2025-04-14', '2025-06-02 03:16:13', '2025-06-02 03:16:13', 'Absent', 0),
(301, 117, '2025-04-15', '2025-06-02 03:16:15', '2025-06-02 03:16:15', 'Present', 0),
(302, 117, '2025-04-07', '2025-06-02 03:16:16', '2025-06-02 03:16:16', 'Present', 0),
(303, 117, '2025-04-08', '2025-06-02 03:16:18', '2025-06-02 03:16:18', 'Present', 0),
(304, 117, '2025-04-01', '2025-06-02 03:16:19', '2025-06-02 03:16:19', 'Present', 0),
(305, 119, '2025-05-26', '2025-06-02 03:17:08', '2025-06-02 03:17:08', 'Present', 0),
(306, 119, '2025-05-28', '2025-06-02 03:17:12', '2025-06-02 03:17:12', 'Present', 0),
(307, 119, '2025-05-19', '2025-06-02 03:17:13', '2025-06-02 03:17:13', 'Present', 0),
(308, 119, '2025-05-21', '2025-06-02 03:17:15', '2025-06-02 03:17:15', 'Present', 0),
(309, 119, '2025-05-12', '2025-06-02 03:17:16', '2025-06-02 03:17:16', 'Present', 0),
(310, 119, '2025-05-14', '2025-06-02 03:17:18', '2025-06-02 03:17:18', 'Present', 0),
(311, 119, '2025-05-05', '2025-06-02 03:17:20', '2025-06-02 03:17:20', 'Present', 0),
(312, 119, '2025-05-07', '2025-06-02 03:17:21', '2025-06-02 03:17:21', 'Late', 0),
(313, 119, '2025-04-30', '2025-06-02 03:17:24', '2025-06-02 03:17:24', 'Absent', 0),
(314, 119, '2025-04-28', '2025-06-02 03:17:27', '2025-06-02 03:17:27', 'Absent', 0),
(315, 119, '2025-04-23', '2025-06-02 03:17:29', '2025-06-02 03:17:29', 'Present', 0),
(316, 119, '2025-04-21', '2025-06-02 03:17:31', '2025-06-02 03:17:31', 'Present', 0),
(317, 119, '2025-04-14', '2025-06-02 03:17:32', '2025-06-02 03:17:32', 'Present', 0),
(318, 119, '2025-04-16', '2025-06-02 03:17:33', '2025-06-02 03:17:33', 'Present', 0),
(319, 119, '2025-04-07', '2025-06-02 03:17:35', '2025-06-02 03:17:35', 'Present', 0),
(320, 119, '2025-04-09', '2025-06-02 03:17:36', '2025-06-02 03:17:36', 'Present', 0),
(321, 119, '2025-04-02', '2025-06-02 03:17:38', '2025-06-02 03:17:38', 'Present', 0),
(322, 169, '2025-06-02', '2025-06-02 06:39:53', '2025-06-02 06:39:53', 'Present', 0),
(323, 120, '2025-06-02', '2025-06-02 06:40:01', '2025-06-02 06:40:01', 'Absent', 0),
(324, 149, '2025-06-10', '2025-06-02 06:40:39', '2025-06-02 06:40:39', 'Present', 0),
(325, 130, '2025-06-10', '2025-06-02 06:40:40', '2025-06-02 06:40:40', 'Present', 0),
(326, 210, '2025-06-10', '2025-06-02 06:40:44', '2025-06-02 06:40:44', 'Present', 0);

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `course_id` bigint NOT NULL,
  `course_code` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `course_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_id`, `course_code`, `course_name`, `description`) VALUES
(1, 'RZL 101', 'Life and Works of Rizal', 'This course explores the life, writings, and ideals of Dr. José Rizal, the national hero of the Philippines. It examines his influence on Philippine nationalism and independence.'),
(2, 'CWORLD 101', 'Contemporary World', 'The course tackles globalization and its multifaceted impact on various aspects of society. It promotes awareness of global issues through critical and interdisciplinary perspectives.'),
(3, 'ETHICS 101', 'Ethics', 'Ethics introduces the principles of moral philosophy and decision-making. It encourages students to reflect on personal and professional responsibilities in a pluralistic society.'),
(4, 'PATHFIT 1', 'PathFit', 'This course promotes physical fitness and healthy living through individualized and group activities. It focuses on improving physical well-being, self-discipline, and a lifelong commitment to wellness.'),
(5, 'ARTAPP 101', 'Art Appreciation', 'Art Appreciation familiarizes students with various art forms, styles, and movements. It encourages critical viewing and valuing of art in both historical and contemporary contexts.'),
(6, 'IT121', 'Computer Programing 2', 'This course advances programming skills with an emphasis on object-oriented programming concepts. Students learn how to design, code, and debug applications using modern programming languages.'),
(7, 'IT122', 'Data Structures & Algorithms', 'Students study how to efficiently organize and process data using various structures and algorithmic strategies. The course strengthens logical thinking and problem-solving in software development.'),
(8, 'IT1232', 'Discrete Mathematics', 'Discrete Math introduces mathematical reasoning and structures used in computing. Topics include logic, set theory, relations, functions, and graph theory.'),
(9, 'UTS', 'Understanding the Self', 'Understanding the Self examines how personal, cultural, and social factors shape individual identity. It encourages self-awareness and personal growth through interdisciplinary insights.'),
(10, 'IT 111', 'Introduction to Computing', 'Introduces fundamental concepts of computing, including hardware, software, and basic programming principles.'),
(11, 'IT 112', 'Computer Programming 1', 'Focuses on problem-solving techniques using structured programming and algorithm development.'),
(12, 'IT 211', 'Human Computer Interaction', 'Explores the design and evaluation of user interfaces, emphasizing user-centered design principles.'),
(13, 'PurCom', 'Purposive Communication\r\n', 'Purposive communication is focuses on delivering messages effectively for a specific purpose and audience. It\'s about understanding the communication process, including elements like context, message, and feedback, to ensure clarity, consistency, and credibility in all forms of communication, whether verbal, written, or visual. '),
(14, 'RPH', 'Readings in Philippine History', 'Readings in Philippine History\" (RPH) is a  general education course that focuses on understanding the country\'s history through the lens of primary sources. It aims to develop critical thinking and analytical skills by examining historical events, perspectives, and interpretations. The course encourages students to analyze sources, understand historical context, and appreciate diverse perspectives on Philippine history. '),
(15, 'MMW', 'Mathematics in the Modern World', 'Mathematics in the Modern World is a general education course that explores the nature of mathematics, its practical applications, and its role in modern life. It aims to help students understand how math is used in everyday situations and its relevance in various fields. '),
(16, 'STS', 'Science, Technology & Society', 'Science, Technology and Society (STS) is an interdisciplinary field that examines the complex relationships between scientific innovation, technological development, and their social, cultural, and political implications. It explores how science and technology shape society and are, in turn, shaped by society. STS encourages critical thinking about the impacts of scientific and technological advancements on individuals, communities, and the global landscape.'),
(17, 'IT212', 'Fundamentals of Database Systems', 'This course introduces the core concepts and principles behind designing, using, and implementing database systems. It covers topics like database modeling, database design, database management systems (DBMS), and database system implementation techniques. The course also delves into database languages like SQL and data manipulation languages (DML).'),
(18, 'IT213', 'Platform Technologies', 'A course that explores how technology is strategically leveraged across multiple applications through a common infrastructure and modular architecture. It focuses on creating reusable services and building blocks that can be combined to create different products and solutions. This course also covers topics like operating systems, computer architecture, and networking, which are fundamental to understanding how platforms work.'),
(19, 'IT214', 'Object Oriented Programming', 'A course that teaches a programming paradigm where software is designed around objects, rather than functions and logic. It focuses on classes and objects, and introduces key concepts like abstraction, encapsulation, inheritance, and polymorphism. Popular programming languages like Java, Python, and C++ are often used as examples in OOP courses.'),
(20, 'IT215', 'Accounting Principles', 'A  course that  provides a foundational understanding of accounting standards and practices, essential for financial reporting. It covers key concepts like Generally Accepted Accounting Principles (GAAP) and International Financial Reporting Standards (IFRS), as well as ethical considerations in financial reporting.'),
(21, 'EnviSci', 'Environmental Science', 'A course that examines the interactions between physical, chemical, and biological components of the Earth\'s environment, focusing on human impact and the development of solutions to environmental problems. It\'s an interdisciplinary field that integrates various sciences like ecology, geology, chemistry, and biology. The goal is to understand how the natural world works, how humans interact with it, and how to mitigate environmental issues.'),
(22, 'IT221', 'Information Management', 'A course that focuses on the systematic organization, storage, protection, and utilization of information within an organization. It covers various aspects of information, including data management, knowledge management, and information security. IM courses often include real-world case studies and projects to develop problem-solving and technical skills.'),
(23, 'IT222', 'Networking 1', 'A  course that provides a foundational understanding of computer networks, covering topics like network topologies, protocols, and architectures. Students learn about essential network components, such as routers, switches, and firewalls, and how to configure and troubleshoot basic network setups. The course also introduces concepts like IP addressing, Ethernet, and wireless networking.'),
(24, 'IT223', 'Web Systems & Technologies', 'This course generally covers the fundamental concepts and techniques for designing, developing, and deploying web applications and websites. Students learn to build both static and dynamic web pages, understand web standards and protocols, and potentially explore server-side programming and database integration. The course also often delves into web security, client-side programming, and the use of various web technologies.'),
(25, 'IT224', 'Systems Integration & Architecture', 'This course focuses on the principles and practices of integrating different systems and applications to create cohesive business solutions. It covers topics like enterprise architecture, application integration, and system integration processes, equipping students with the knowledge to design, implement, and manage integrated systems.'),
(29, 'ENGR101', 'Introduction to Engineering', 'An overview of the engineering profession, covering major disciplines, problem-solving methods, ethics, and design principles. Includes team-based projects and hands-on experiences.'),
(30, 'ENGR201', 'Engineering Mechanics: Statics', 'Fundamentals of statics including forces, moments, equilibrium, and structures. Application to real-world mechanical systems and structures.'),
(31, 'ENGR210', 'Thermodynamics I', 'Introduction to thermodynamic principles including energy conservation, the laws of thermodynamics, and basic heat engine and refrigeration cycles.'),
(32, 'ENGR220', 'Circuit Analysis', 'Covers the basics of electrical circuits including Ohm’s Law, Kirchhoff’s Laws, Thevenin and Norton equivalents, and AC/DC circuit analysis techniques.'),
(33, 'ENGR230', 'Materials Science and Engineering', 'Study of the structure and properties of materials used in engineering. Includes metals, ceramics, polymers, and composites, and their applications.'),
(34, 'ENGR240', 'Fluid Mechanics', 'Covers fluid properties, pressure, buoyancy, fluid dynamics, and applications in piping and open channel flow systems.'),
(35, 'ENGR250', 'Engineering Mathematics', 'Mathematical techniques used in engineering, including differential equations, linear algebra, complex numbers, and Laplace transforms.'),
(36, 'ENGR301', 'Control Systems Engineering', 'Introduction to feedback and control systems. Topics include system modeling, time and frequency domain analysis, and controller design.'),
(37, 'ENGR320', 'Engineering Design and Project Management', 'Focuses on engineering design processes and project management methodologies. Students work in teams to plan, design, and present a comprehensive engineering project.'),
(38, 'ENGR330', 'Embedded Systems', 'Covers microcontrollers, sensors, and real-time software for embedded applications. Includes lab work on interfacing hardware and programming using C/C++.'),
(39, 'CE301', 'Structural Analysis', 'Introduction to the analysis of statically determinate and indeterminate structures used in civil engineering.'),
(40, 'CE302', 'Reinforced Concrete Design', 'Study of the design principles of reinforced concrete elements such as beams, slabs, and columns.'),
(41, 'CE303', 'Hydraulics and Hydrology', 'Covers fluid mechanics, open channel flow, and water cycle processes for civil engineering applications.'),
(42, 'CE304', 'Construction Methods and Project Management', 'Focuses on construction procedures, equipment, and project planning, scheduling, and control.'),
(43, 'CE305', 'Soil Mechanics', 'Examines the properties and behavior of soils, including classification, permeability, and shear strength relevant to foundations.');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `department_id` bigint NOT NULL,
  `department_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`department_id`, `department_name`, `description`) VALUES
(1, 'CITC', 'Specializes in information technology, computer science, and related computing disciplines, emphasizing modern technological solutions.'),
(2, 'CEA', 'Offers programs in various engineering fields and architecture, focusing on innovative design and practical applications.'),
(3, 'COT', 'Provides education in pure and applied sciences, including mathematics, physics, and chemistry, fostering analytical and research skills.'),
(4, 'CSM', 'Focuses on training educators in science and technology fields, integrating pedagogical methods with technical expertise.'),
(5, 'CSTE', 'Offers technical and vocational programs aimed at equipping students with practical skills for various industries.');

-- --------------------------------------------------------

--
-- Table structure for table `drop_history`
--

CREATE TABLE `drop_history` (
  `history_id` bigint NOT NULL,
  `drop_request_id` bigint DEFAULT NULL,
  `reason` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Dropped',
  `dropped_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `student_details_id_at_drop` bigint DEFAULT NULL,
  `student_id_at_drop` bigint DEFAULT NULL,
  `student_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `program_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `course_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `instructor_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drop_history`
--

INSERT INTO `drop_history` (`history_id`, `drop_request_id`, `reason`, `status`, `dropped_at`, `student_details_id_at_drop`, `student_id_at_drop`, `student_name`, `program_name`, `course_name`, `instructor_name`) VALUES
(5, 21, 'Absent 3 times', 'Dropped', '2025-06-01 17:24:56', 126, 46, 'Dan - Heng', 'BSIT', 'Control Systems Engineering', 'Anthony Edward Stark'),
(6, 22, 's', 'Dropped', '2025-06-02 11:07:04', 806, 186, 'Monkey Ace Luffy', 'BSCE', 'Structural Analysis', 'Anthony Edward Stark'),
(7, 23, 'sds', 'Dropped', '2025-06-02 11:07:08', 814, 194, 'Light Soichiro Yagami', 'BSCE', 'Mathematics in the Modern World', 'Anthony Edward Stark');

-- --------------------------------------------------------

--
-- Table structure for table `drop_request`
--

CREATE TABLE `drop_request` (
  `drop_request_id` bigint NOT NULL,
  `student_details_id` bigint NOT NULL,
  `reason` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('Pending','Dropped','Rejected','') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drop_request`
--

INSERT INTO `drop_request` (`drop_request_id`, `student_details_id`, `reason`, `status`) VALUES
(24, 160, 'absenot', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `excused_request`
--

CREATE TABLE `excused_request` (
  `excused_request_id` bigint NOT NULL,
  `student_details_id` bigint NOT NULL,
  `reason` text COLLATE utf8mb4_general_ci NOT NULL,
  `date_requested` date NOT NULL,
  `date_of_absence` date NOT NULL,
  `status` enum('Pending','Approved','Rejected','') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending',
  `file_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `excused_request`
--

INSERT INTO `excused_request` (`excused_request_id`, `student_details_id`, `reason`, `date_requested`, `date_of_absence`, `status`, `file_path`) VALUES
(13, 210, 'YIPPIIIEEE', '2025-06-01', '2025-06-02', 'Approved', 'uploads/683bf0b1cc178_download32.jpg'),
(14, 119, 'adad', '2025-06-02', '2025-06-10', 'Pending', 'uploads/683d06034b2fb_Captain_America_Uniform_IIIIIIIIIIII.webp'),
(15, 117, 'I have a very hard cough', '2025-06-02', '2025-06-02', 'Pending', 'uploads/683d172a7ff07_1.webp'),
(17, 121, 'I need to have some time for myself', '2025-06-03', '2025-06-07', 'Pending', 'uploads/683ea2af4a6f6_scarlet_witch_darkhold.gif');

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `instructor_id` bigint NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(127) COLLATE utf8mb4_general_ci NOT NULL,
  `firstname` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `middlename` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `date_of_birth` date NOT NULL,
  `contact_number` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `street` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `province` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `zipcode` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`instructor_id`, `email`, `password`, `firstname`, `middlename`, `lastname`, `date_of_birth`, `contact_number`, `street`, `city`, `province`, `zipcode`, `country`, `image`) VALUES
(1, 'ironman@ustp.cdo', '$2y$10$fKN.ljaU90GbyeiP53Ybq.vIl3XbN5NybB5W8fOLnqOaCArcHSDYK', 'Anthony', 'Edward', 'Stark', '1970-05-29', '0917 834 2901', '10880 Malibu Point', 'Malibu', 'California', '90265', 'United States', 'instructor_683ea493ab9cf_Iron_Man_Uniform_IIIII.webp'),
(2, 'firstavenger@ustp.cdo', '$2y$10$M1k.zoNYrbQ5Qn35Y6DEnOFiRsGq3u7jetA2VbJhe9OdBwhX3sL7.', 'Steve', 'Grant', 'Rogers', '1918-07-04', '09268790214', '569 Brooklyn Avenue', 'Brooklyn', 'New York', '11201', 'United States', 'instructor_683b3b22b4e46_Captain_America_Uniform_IIIIIIIIIIII.webp'),
(3, 'wintersoldier@ustp.cdo', '$2y$10$AiSBw53jA5B.MU5KcyW3IOQT.Vvgb5GkHxUyqsCQK/ZqGTITlveZa', 'James', 'Buchanan', 'Barnes', '1917-03-10', '09159084376', '47-88 Dodworth Street', 'Brooklyn', 'New York', '11206', 'United States', 'instructor_683b3b3fba532_Winter_Soldier_Uniform_IIII.webp'),
(4, 'capamerica@ustp.cdo', '$2y$10$92CHoy7335ap60koRryYwuhkNv.BqU01hLTKqriveMlmSmQY9E5zS', 'Samuel', 'Thomas', 'Wilson', '1978-09-23', '09172318740', '1325 Liberty Avenue', 'Harlem', 'New York', '10027', 'United States', 'instructor_683b3b46dc61f_Falcon_Uniform_IIII.webp'),
(5, 'hulksmash@ustp.cdo', '$2y$10$fYsm6.xnfr4cms72XrIsyusOmSc7d9IVU.wv7/ZIKjtbaQuW0lWii', 'Robert', 'Bruce', 'Banner', '1969-12-18', '0995 217 8432', '420 Gamma Drive', 'Dayton', 'Ohio', '45402', 'United States', 'uploads/682c3230482b6_bruce banner.webp'),
(30, 'professorx@ustp.cdo', '$2y$10$64RjiaBDk4R9mTJbcGNq4e85gPvlm3PbaOLhDHN1C/OVabeA3va/a', 'Charles', 'Francis', 'Xavier', '1947-07-17', '09176543821', '1407 Graymalkin Lane', 'Salem Center', 'Westchester County, New York', '10560', 'United States of America', '683b262086f9e_Professor_X_Uniform_I.webp'),
(31, 'doctorstrange@ustp.cdo', '$2y$10$xtiMIFD9EXdsWuoayfS7WuiEyGO7JuVjYX6Wby8PgnVCWoWKYJT3.', 'Stephen', 'Vincent', 'Strange', '1975-02-10', ' 0936 289 7742', '177A Bleecker Street', 'Greenwich Village', 'New York', '10012', 'United States', '683b2898a8024_Doctor_Strange_Uniform_IIII.png'),
(32, 'misterfantastic@ustp.cdo', '$2y$10$TYwwe/E4vMAc.8c15n5oXeBzlA4UxgsGDH3KIAcrZZYMAsSpRP0kS', 'Reed', 'Nathaniel', 'Richards', '1961-11-18', '0918 703 1165', '4 Freedom Plaza', 'Manhattan', 'New York', '10001', 'United States', '683b28d903536_Mister_Fantastic_Uniform_I.webp'),
(33, 'antman@ustp.cdo', '$2y$10$v7mkNHACtZViyJ2fJrQwwuWWI.LcQPt7R0fl.PJcOLl3LZpzKJR/m', 'Scott', 'Edward', 'Lang', '1979-04-06', '0958 461 2370', '2313 Alameda Avenue', 'San Francisco', 'California', '94110', 'United States', '683b293841203_Ant-Man_Uniform_IIIIII.webp'),
(34, 'pheonix@ustp.cdo', '$2y$10$Lt/STb4t2H6kQP9s1Uw4MuTqin.cxDpCZFyEsM9gueoIsFXktXSJq', 'Jean', 'Elaine', 'Grey', '1984-09-23', '0949 720 2341', 'Xavier Institute Grounds', 'Salem Center', 'New York', '10560', 'United States', '683b298717ec6_Jean_Grey_Uniform_II.webp');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2025_05_18_181413_create_sessions_table', 1),
(2, '2025_05_18_190636_create_sessions_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `program_id` bigint NOT NULL,
  `program_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`program_id`, `program_name`, `description`) VALUES
(1, 'BSIT', 'A comprehensive program that covers the development, implementation, and management of computer-based information systems. Students gain proficiency in programming, systems administration, web technologies, and cybersecurity, preparing them for careers in software development, IT support, and network administration.'),
(2, 'BSCE', 'This program provides students with a strong foundation in the principles and practices of civil engineering. It includes coursework in structural analysis, geotechnical engineering, transportation, and environmental engineering, preparing graduates to design, construct, and maintain infrastructure projects such as roads, bridges, and buildings.'),
(3, 'BSET', 'A hands-on program that emphasizes the practical application of engineering principles in fields such as electrical, mechanical, and electronics technology.'),
(4, 'BSDS', 'This specialized program integrates computer science, statistics, and domain-specific knowledge to enable students to analyze and interpret complex data. It trains students in data analytics, machine learning, and data visualization, making them highly competitive in sectors driven by data-based decision-making.'),
(5, 'BSED', 'A teacher education program that prepares students to teach at the secondary level. It integrates foundational education courses with subject-specific pedagogy and practice teaching.');

-- --------------------------------------------------------

--
-- Table structure for table `program_details`
--

CREATE TABLE `program_details` (
  `program_details_id` bigint NOT NULL,
  `program_id` bigint NOT NULL,
  `department_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_details`
--

INSERT INTO `program_details` (`program_details_id`, `program_id`, `department_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 2),
(4, 4, 1),
(5, 5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `section_id` bigint NOT NULL,
  `section_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `year_level_id` int DEFAULT NULL,
  `semester_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`section_id`, `section_name`, `year_level_id`, `semester_id`) VALUES
(8, 'IT2A', 2, 1),
(10, 'IT2C', 2, 2),
(11, 'IT3A', 3, 1),
(13, 'IT3C', 3, 2),
(14, 'IT4A', 4, 1),
(15, 'IT4B', 4, 2),
(18, 'IT1A', 1, 1),
(20, 'IT1C', 1, 2),
(40, 'IT1B', 1, 1),
(41, 'CE3A', 3, 2),
(42, 'CE3B', 3, 2),
(43, 'CE3C', 3, 2),
(44, 'CE3D', 3, 2),
(45, 'CE3E', 3, 2),
(46, 'CE4A', 4, 1),
(47, 'CE4B', 4, 1),
(48, 'CE4C', 4, 1),
(49, 'CE4D', 4, 1),
(50, 'CE4E', 4, 1),
(51, 'CE4A', 4, 2),
(52, 'CE4B', 4, 2),
(53, 'CE4C', 4, 2),
(54, 'CE4D', 4, 2),
(55, 'CE4E', 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `section_courses`
--

CREATE TABLE `section_courses` (
  `section_course_id` bigint NOT NULL,
  `section_id` bigint NOT NULL,
  `course_id` bigint NOT NULL,
  `instructor_id` bigint NOT NULL,
  `schedule_day` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `start_time` time NOT NULL DEFAULT '00:00:00',
  `end_time` time NOT NULL DEFAULT '00:00:00',
  `image` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'classes_vector_2',
  `hexcode` varchar(100) COLLATE utf8mb4_general_ci DEFAULT '#0097b2'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section_courses`
--

INSERT INTO `section_courses` (`section_course_id`, `section_id`, `course_id`, `instructor_id`, `schedule_day`, `start_time`, `end_time`, `image`, `hexcode`) VALUES
(55, 18, 4, 2, 'Monday & Tuesday', '08:30:00', '11:30:00', 'classes_vector_8.png', '#f1ffa8'),
(56, 18, 8, 30, 'Thursday & Friday', '17:00:00', '18:30:00', 'classes_vector_5.png', '#e83efe'),
(57, 18, 11, 33, 'Monday & Wednesday', '15:00:00', '18:00:00', 'classes_vector_6.png', '#ff4284'),
(58, 18, 13, 34, 'Thursday & Saturday', '08:00:00', '09:30:00', 'classes_vector_7.png', '#9ef0ff'),
(59, 18, 12, 1, 'Monday & Tuesday', '10:30:00', '13:30:00', 'classes_vector_5.png', '#ff2974'),
(65, 20, 5, 33, 'Friday & Saturday', '08:30:00', '10:00:00', 'classes_vector_2.png', '#0097b2'),
(66, 20, 7, 1, 'Monday & Tuesday', '10:00:00', '01:00:00', 'classes_vector_7.png', '#80ecff'),
(67, 20, 6, 32, 'Monday & Thursday', '16:30:00', '18:30:00', 'classes_vector_2.png', '#0097b2'),
(68, 20, 21, 31, 'Tuesday & Friday', '12:00:00', '13:30:00', 'classes_vector_2.png', '#0097b2'),
(69, 20, 18, 30, 'Thursday & Saturday', '16:30:00', '18:30:00', 'classes_vector_2.png', '#0097b2'),
(70, 40, 11, 1, 'Thursday & Friday', '11:30:00', '14:30:00', 'classes_vector_2.png', '#0097b2'),
(71, 40, 8, 33, 'Friday & Saturday', '07:00:00', '10:00:00', 'classes_vector_2.png', '#0097b2'),
(72, 40, 12, 32, 'Tuesday & Saturday', '10:00:00', '01:00:00', 'classes_vector_2.png', '#0097b2'),
(73, 40, 4, 3, 'Monday & Friday', '13:00:00', '16:00:00', 'classes_vector_2.png', '#0097b2'),
(74, 40, 13, 31, 'Wednesday & Saturday', '18:00:00', '19:30:00', 'classes_vector_2.png', '#0097b2'),
(75, 8, 4, 4, 'Tuesday & Saturday', '15:00:00', '16:30:00', 'classes_vector_2.png', '#0097b2'),
(76, 8, 20, 33, 'Tuesday & Thursday', '18:00:00', '19:30:00', 'classes_vector_2.png', '#0097b2'),
(77, 8, 25, 1, 'Monday & Wednesday', '16:00:00', '18:00:00', 'classes_vector_8.png', '#db5dfe'),
(78, 8, 19, 32, 'Monday & Tuesday', '07:00:00', '10:00:00', 'classes_vector_2.png', '#0097b2'),
(79, 10, 4, 1, 'Monday & Saturday', '12:00:00', '14:00:00', 'classes_vector_5.png', '#ff05b0'),
(80, 10, 31, 32, 'Tuesday & Saturday', '12:00:00', '15:00:00', 'classes_vector_2.png', '#0097b2'),
(81, 10, 17, 2, 'Thursday & Friday', '08:00:00', '10:00:00', 'classes_vector_2.png', '#0097b2'),
(82, 10, 16, 34, 'Monday & Tuesday', '17:00:00', '19:00:00', 'classes_vector_2.png', '#0097b2'),
(83, 18, 32, 32, 'Tuesday & Saturday', '12:00:00', '15:00:00', 'classes_vector_2.png', '#0097b2'),
(84, 18, 36, 1, 'Tuesday & Wednesday', '08:00:00', '13:00:00', 'classes_vector_2.png', '#0097b2'),
(85, 18, 38, 30, 'Tuesday & Thursday', '15:00:00', '16:30:00', 'classes_vector_2.png', '#0097b2'),
(86, 40, 32, 1, 'Tuesday & Wednesday', '08:00:00', '13:00:00', 'classes_vector_3.png', '#8aedff'),
(87, 40, 36, 1, 'Tuesday & Wednesday', '17:30:00', '20:00:00', 'classes_vector_8.png', '#fff700'),
(88, 40, 38, 30, 'Monday & Saturday', '07:00:00', '08:30:00', 'classes_vector_2.png', '#0097b2'),
(89, 20, 37, 4, 'Tuesday & Wednesday', '07:00:00', '10:00:00', 'classes_vector_2.png', '#0097b2'),
(90, 20, 35, 5, 'Monday & Friday', '08:00:00', '11:00:00', 'classes_vector_2.png', '#0097b2'),
(91, 20, 30, 34, 'Monday & Wednesday', '09:00:00', '13:00:00', 'classes_vector_2.png', '#0097b2'),
(92, 10, 23, 5, 'Monday & Saturday', '17:00:00', '19:00:00', 'classes_vector_2.png', '#0097b2'),
(93, 10, 1, 34, 'Monday & Wednesday', '15:00:00', '16:30:00', 'classes_vector_2.png', '#0097b2'),
(94, 10, 15, 33, 'Friday & Saturday', '19:30:00', '21:00:00', 'classes_vector_2.png', '#0097b2'),
(95, 11, 9, 34, 'Tuesday & Saturday', '09:00:00', '01:00:00', 'classes_vector_2.png', '#0097b2'),
(96, 11, 10, 33, 'Tuesday & Friday', '18:00:00', '19:30:00', 'classes_vector_2.png', '#0097b2'),
(97, 11, 33, 2, 'Tuesday & Friday', '13:00:00', '16:00:00', 'classes_vector_2.png', '#0097b2'),
(98, 11, 2, 1, 'Tuesday & Wednesday', '15:00:00', '16:30:00', 'classes_vector_8.png', '#ff70c3'),
(99, 11, 4, 3, 'Wednesday & Thursday', '16:00:00', '19:00:00', 'classes_vector_2.png', '#0097b2'),
(100, 13, 4, 1, 'Tuesday & Friday', '16:00:00', '18:00:00', 'classes_vector_2.png', '#0097b2'),
(101, 13, 5, 5, 'Tuesday & Thursday', '15:00:00', '16:30:00', 'classes_vector_2.png', '#0097b2'),
(102, 13, 21, 34, 'Wednesday & Thursday', '16:00:00', '17:30:00', 'classes_vector_2.png', '#0097b2'),
(103, 13, 18, 30, 'Tuesday & Saturday', '18:00:00', '19:30:00', 'classes_vector_2.png', '#0097b2'),
(104, 14, 17, 1, 'Wednesday & Thursday', '16:00:00', '18:00:00', 'classes_vector_2.png', '#0097b2'),
(105, 14, 4, 33, 'Monday & Tuesday', '18:00:00', '19:30:00', 'classes_vector_2.png', '#0097b2'),
(106, 14, 2, 5, 'Tuesday & Thursday', '15:00:00', '16:30:00', 'classes_vector_2.png', '#0097b2'),
(107, 14, 36, 31, 'Wednesday & Friday', '18:00:00', '19:30:00', 'classes_vector_2.png', '#0097b2'),
(108, 15, 4, 1, 'Tuesday & Saturday', '17:30:00', '19:00:00', 'classes_vector_2.png', '#0097b2'),
(109, 15, 5, 34, 'Tuesday & Saturday', '07:00:00', '10:00:00', 'classes_vector_2.png', '#0097b2'),
(110, 15, 38, 4, 'Monday & Tuesday', '18:00:00', '19:30:00', 'classes_vector_2.png', '#0097b2'),
(111, 15, 15, 31, 'Wednesday & Thursday', '20:00:00', '21:30:00', 'classes_vector_2.png', '#0097b2'),
(112, 41, 39, 1, 'Monday & Wednesday', '08:00:00', '09:30:00', 'classes_vector_2.png', '#0097b2'),
(113, 41, 1, 30, 'Tuesday & Thursday', '10:00:00', '11:30:00', 'classes_vector_2.png', '#0097b2'),
(114, 41, 13, 2, 'Friday & Saturday', '13:00:00', '15:00:00', 'classes_vector_2.png', '#0097b2'),
(115, 42, 40, 3, 'Monday & Wednesday', '10:00:00', '11:30:00', 'classes_vector_2.png', '#0097b2'),
(116, 42, 2, 31, 'Tuesday & Thursday', '08:00:00', '09:30:00', 'classes_vector_2.png', '#0097b2'),
(117, 42, 14, 4, 'Wednesday & Friday', '15:00:00', '17:00:00', 'classes_vector_2.png', '#0097b2'),
(118, 43, 41, 5, 'Monday & Wednesday', '13:00:00', '14:30:00', 'classes_vector_2.png', '#0097b2'),
(119, 43, 3, 32, 'Tuesday & Thursday', '14:00:00', '15:30:00', 'classes_vector_2.png', '#0097b2'),
(120, 43, 15, 1, 'Monday & Friday', '08:00:00', '10:00:00', 'classes_vector_2.png', '#0097b2'),
(121, 44, 42, 2, 'Monday & Wednesday', '15:00:00', '16:30:00', 'classes_vector_2.png', '#0097b2'),
(122, 44, 4, 33, 'Tuesday & Thursday', '10:00:00', '11:30:00', 'classes_vector_2.png', '#0097b2'),
(123, 44, 16, 3, 'Friday & Thursday', '10:00:00', '12:00:00', 'classes_vector_2.png', '#0097b2'),
(124, 45, 43, 34, 'Monday & Wednesday', '07:00:00', '08:30:00', 'classes_vector_2.png', '#0097b2'),
(125, 45, 5, 4, 'Tuesday & Thursday', '13:00:00', '14:30:00', 'classes_vector_2.png', '#0097b2'),
(126, 45, 1, 5, 'Friday & Wednesday', '12:00:00', '14:00:00', 'classes_vector_2.png', '#0097b2'),
(127, 46, 39, 2, 'Monday & Wednesday', '08:00:00', '09:30:00', 'classes_vector_2.png', '#0097b2'),
(128, 46, 3, 30, 'Tuesday & Thursday', '10:00:00', '11:30:00', 'classes_vector_2.png', '#0097b2'),
(129, 46, 14, 4, 'Tuesday & Thursday', '13:00:00', '15:00:00', 'classes_vector_2.png', '#0097b2'),
(130, 47, 40, 1, 'Monday & Wednesday', '10:00:00', '11:30:00', 'classes_vector_2.png', '#0097b2'),
(131, 47, 1, 31, 'Tuesday & Thursday', '08:00:00', '09:30:00', 'classes_vector_2.png', '#0097b2'),
(132, 47, 13, 5, 'Tuesday & Thursday', '15:00:00', '17:00:00', 'classes_vector_2.png', '#0097b2'),
(133, 48, 41, 32, 'Monday & Wednesday', '13:00:00', '14:30:00', 'classes_vector_2.png', '#0097b2'),
(134, 48, 2, 3, 'Tuesday & Thursday', '14:00:00', '15:30:00', 'classes_vector_2.png', '#0097b2'),
(135, 48, 15, 1, 'Tuesday & Thursday', '08:00:00', '10:00:00', 'classes_vector_7.png', '#9afeae'),
(136, 49, 42, 33, 'Monday & Wednesday', '15:00:00', '16:30:00', 'classes_vector_2.png', '#0097b2'),
(137, 49, 4, 2, 'Tuesday & Thursday', '10:00:00', '11:30:00', 'classes_vector_2.png', '#0097b2'),
(138, 49, 16, 34, 'Tuesday & Thursday', '10:00:00', '12:00:00', 'classes_vector_2.png', '#0097b2'),
(139, 50, 43, 5, 'Monday & Wednesday', '07:00:00', '08:30:00', 'classes_vector_2.png', '#0097b2'),
(140, 50, 5, 4, 'Tuesday & Thursday', '13:00:00', '14:30:00', 'classes_vector_2.png', '#0097b2'),
(141, 50, 1, 2, 'Tuesday & Thursday', '12:00:00', '14:00:00', 'classes_vector_2.png', '#0097b2'),
(142, 41, 29, 1, 'Monday & Wednesday', '08:00:00', '09:30:00', 'classes_vector_5.png', '#fbff00'),
(143, 41, 30, 2, 'Tuesday & Thursday', '10:00:00', '11:30:00', 'classes_vector_2.png', '#0097b2'),
(144, 41, 31, 3, 'Wednesday & Friday', '13:00:00', '14:30:00', 'classes_vector_2.png', '#0097b2'),
(145, 41, 32, 4, 'Monday & Wednesday', '15:00:00', '16:30:00', 'classes_vector_2.png', '#0097b2'),
(146, 41, 33, 30, 'Tuesday & Thursday', '08:00:00', '09:30:00', 'classes_vector_2.png', '#0097b2'),
(147, 42, 34, 31, 'Monday & Wednesday', '10:00:00', '11:30:00', 'classes_vector_2.png', '#0097b2'),
(148, 42, 35, 5, 'Wednesday & Friday', '13:00:00', '14:30:00', 'classes_vector_2.png', '#0097b2'),
(149, 42, 36, 2, 'Tuesday & Thursday', '15:00:00', '16:30:00', 'classes_vector_2.png', '#0097b2'),
(150, 42, 37, 3, 'Monday & Wednesday', '08:00:00', '09:30:00', 'classes_vector_2.png', '#0097b2'),
(151, 42, 38, 1, 'Wednesday & Friday', '10:00:00', '11:30:00', 'classes_vector_3.png', '#ff004c');

-- --------------------------------------------------------

--
-- Table structure for table `semester`
--

CREATE TABLE `semester` (
  `semester_id` int NOT NULL,
  `semester_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `semester`
--

INSERT INTO `semester` (`semester_id`, `semester_name`) VALUES
(1, '1st Semester'),
(2, '2nd Semester');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` bigint NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(127) COLLATE utf8mb4_general_ci NOT NULL,
  `firstname` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `middlename` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `date_of_birth` date NOT NULL,
  `contact_number` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `street` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `province` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `zipcode` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `email`, `password`, `firstname`, `middlename`, `lastname`, `date_of_birth`, `contact_number`, `street`, `city`, `province`, `zipcode`, `country`, `image`) VALUES
(45, 'phainon@ustp.cdo', 'gnarly', 'Phainon', 'Kevin', 'Kaslana', '2016-01-14', '09123456789', '', '', '', '', '', 'student_683ea2818a03d_Character_Phainon_Icon.webp'),
(46, 'danheng@ustp.cdo', 'gnarly', 'Dan', '-', 'Heng', '2025-05-06', '09262103722', '', '', '', '', '', '683b3e58b1273_Character_Dan_Heng_Icon.webp'),
(47, 'boothil@ustp.cdo', 'gnarly', 'Boothil', 'Káh', 'dił\'tush', '2025-05-07', '09262103722', '', '', '', '', '', '683b3ea186a95_Character_Boothill_Icon.webp'),
(48, 'jiaoqiu@ustp.cdo', 'gnarly', 'Jiao', '-', 'qiu', '2025-06-10', '09123456789', '', '', '', '', '', '683b3eff5f838_Character_Jiaoqiu_Icon.webp'),
(49, 'mydei@ustp.cdo', 'gnarly', 'Mydei', '-', 'Mos', '2025-05-13', '09123456789', '', '', '', '', '', '683b3f36abf27_Character_Mydei_Icon.webp'),
(50, 'hyacine@ustp.cdo', 'gnarly', 'Hyacine', '-', 'Ica', '2025-05-12', '09262103722', '', '', '', '', '', '683b3f73e19d6_Character_Hyacine_Icon.webp'),
(51, 'march@ustp.cdo', 'g/narly', 'March', '-', '7th', '2025-06-17', '09123456789', '', '', '', '', '', '683b3fa0378f0_Character_March_7th_Icon.webp'),
(52, 'fugue@ustp.cdo', 'gnarly', 'Tingyun', '-', 'Fugue', '2025-05-14', '09192648751', '', '', '', '', '', '683b40ce494cd_Character_Fugue_Icon.webp'),
(53, 'saber@ustp.cdo', 'gnarly', 'Arthuria', '-', 'Pendragon', '2025-04-21', '09192648751', '', '', '', '', '', '683b40fa031c3_Character_Saber_Icon.webp'),
(54, 'caelus@ustp.cdo', 'gnarly', 'Caelus', '-', 'Trailblazer', '2025-04-14', '09262103722', '', '', '', '', '', '683b41f0296c2_Character_Caelus_29_Icong.webp'),
(55, 'ruanmei@ustp.cdo', 'gnarly', 'Ruan', '-', 'Mei', '2025-04-30', '09262103722', '', '', '', '', '', '683b422b13d79_Character_Ruan_Mei_Icon.webp'),
(56, 'jingyuan@ustp.cdo', 'gnarly', 'Jing', '-', 'Yuan', '2025-03-05', '09182345678', '', '', '', '', '', '683b42a52cfa4_Character_Jing_Yuan_Icon.webp'),
(57, 'dhil@ustp.cdo', 'gnarly', 'Imbibitor', '-', 'Lunae', '2025-04-22', '09123456789', '', '', '', '', '', '683b430214ae9_Character_Dan_Heng_3F_Imbibitor_Lunae_Icon.webp'),
(58, 'castorice@ustp.cdo', 'gnarly', 'Castorice', '-', 'Pollux', '2025-04-29', '09182345678', '', '', '', '', '', '683b43609aecf_Character_Castorice_Icon.webp'),
(59, 'acheron@ustp.cdo', 'gnarly', 'Raiden', 'Bosenmori', 'Mei', '2025-04-21', '09192648751', '', '', '', '', '', '683b43b4c75a0_Character_Acheron_Icon.webp'),
(60, 'kafka@ustp.cdo', 'gnarly', 'Kafka', '-', 'Stellaron', '2025-02-25', '09123456789', '', '', '', '', '', '683b43f918642_Character_Kafka_Icon.webp'),
(61, 'blackswan@ustp.cdo', 'gnarly', 'Black', '-', 'Swan', '2025-05-07', '09262103722', '', '', '', '', '', '683b45cbe662d_Character_Black_Swan_Icon.webp'),
(62, 'sam@ustp.cdo', 'gnarly', 'SAM', '-', 'Firefly', '2025-04-29', '09192648751', '', '', '', '', '', '683b45f837a05_Character_Firefly_Icon.webp'),
(63, 'jessielina@ustp.cdo', 'gnarly', 'Jessie', 'Rose', 'Young', '2004-01-21', '09564663251', '4 Emerald Street', 'Cerulean City', 'Paldea', '9000', 'Philippines', '683c026accba6_8.png'),
(64, 'eleanor@ustp.cdo', 'GNARLY', 'Eleanor', 'Grace', 'Mendoza', '2002-10-12', '0917 123 4567', '14 Rizal Street', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', '683c027a58ac8_9.png'),
(65, 'amelia@ustp.cdo', 'gnarly', 'Amelia Claire', '-', 'Ramirez', '2004-03-28', '0917 234 5678', 'Block 5, Lot 10, Kauswagan Road', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', '683c028bb7f84_10.png'),
(66, 'sophia@ustp.cdo', 'gnarly', 'Sophia', 'Louise', 'Reyes', '2003-07-05', '0917 345 6789', '22 Acacia Drive, Bulua', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', '683c02a24ffa8_1.png'),
(67, 'olivia@ustp.cdo', 'gnarly', 'Olivia Mae', 'Manubat', 'Santos', '2001-11-19', '0917 456 7890', 'Phase 3, Xavier Heights, Upper Balulang', 'Cagayan de Oro City', 'Misamis Oriental', '9000', 'Philippines', '683c02b62033d_2.png'),
(68, 'isabella@ustp.cdo', 'gnarly', 'Isabella Joy', 'Dylan', 'Dela Cruz', '0004-12-02', '0917 567 8901', '8 Gumamela Street, Carmen', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', '683c0250d8403_3.png'),
(69, 'charlotte@ustp.cdo', 'gnarly', 'Charlotte', '-', 'Garcia', '2003-04-08', '0917 678 9012', 'Zone 7, Patag', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', '683c032848185_4.png'),
(70, 'scarlett@ustp.cdo', 'gnarly', 'Scarlett', 'Rose', 'Cruz', '0002-09-12', '0917 789 0123', '15 Velez Street', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', '683c03cf7ff07_5.png'),
(71, 'victoria@ustp.cdo', 'gnarly', 'Victoria Anne', '-', 'Lim', '2004-02-14', '0917 890 1234', 'Block 12, Gusa Highway', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', '683c04408bb80_6.png'),
(72, 'audrey@ustp.cdo', 'gnarly', 'Audrey', 'Grace', 'Tan', '2003-06-21', '0917 012 3456', '20 Corrales Avenue', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', '683c04a4b65bb_7.png'),
(73, 'madeline@ustp.cdo', 'gnarly', 'Madeline', 'Hope', 'Castro', '2001-12-31', '0917 112 3344', 'Lumbia Diversion Road, Zone 2', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', '683c050c24c73_11.png'),
(74, 'evelyn@ustp.cdo', 'gnarly', 'Evelyn', 'Libra', 'Night', '2002-08-07', '0917 223 4455', '7 National Highway, Lapasan', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', '683c058f989e7_12.png'),
(75, 'scarletwitch@ustp.cdo', 'gnarly', 'Wanda', '-', 'Maximoff', '2025-04-29', '09262103722', '', '', '', '', '', '683c0bd0e7eac_Scarlet_Witch_Uniform_III.png'),
(76, 'franklinrichards@ustp.cdo', 'gnarly', 'Franklin', 'Benji', 'Richards', '2025-04-08', '09262103722', '', '', '', '', '', '683c0c33c3ded_franklinrichards.png'),
(77, 'valeriarichards@ustp.cdo', 'gnarly', 'Valeria', 'Meghan', 'Richards', '2025-06-06', '09192648751', '', '', '', '', '', '683c0c5c4852e_valeriarichards.png'),
(78, 'goblinqueen@ustp.cdo', 'gnarly', 'Madelyne', 'Jennifer', 'Pryor', '2025-04-15', '09192648751', '', '', '', '', '', '683c0c94bdc30_madelynepryor.png'),
(79, 'sylvie@ustp.cdo', 'gnarly', 'Sylvie', '-', 'Laufeydottir', '2025-05-07', '09192648751', '', '', '', '', '', '683c0ccdb25fc_sylvie.png'),
(80, 'polaris@ustp.cdo', 'gnarly', 'Lorna', '-', 'Dane', '2025-04-23', '09262103722', '', '', '', '', '', '683c0d5f2dae6_polaris.png'),
(81, 'hawkeye@ustp.cdo', 'gnarly', 'Clint', 'Francis', 'Barton', '2025-04-22', '09182345678', '', '', '', '', '', '683c0d8ebe2f0_hawkeye5.png'),
(82, 'spiderman@ustp.cdo', 'gnarly', 'Peter', 'Benjamin', 'Parker', '2025-05-06', '09192648751', '', '', '', '', '', '683c0db6de3ad_spiderman8.png'),
(83, 'magneto@ustp.cdo', 'gnarly', 'Erik', 'Max', 'Lehnsherr', '2025-04-15', '09192648751', '', '', '', '', '', '683c0dea27696_magneto2.png'),
(84, 'katebishop@ustp.cdo', 'gnarly', 'Kate', '-', 'Bishop', '2025-04-15', '09192648751', '', '', '', '', '', '683c0e1226e22_katebishop1.png'),
(85, 'jessicajones@ustp.cdo', 'gnarly', 'Jessica', 'Jewel', 'Jones', '2025-04-30', '09262103722', '', '', '', '', '', '683c0e4e8b220_Jessica_Jones_Uniform_I.webp'),
(86, 'americachavez@ustp.cdo', 'gnarly', 'America', '-', 'Chavez', '2025-04-29', '09262103722', '', '', '', '', '', '683c0ed0800f5_America_Chavez_Uniform_II.webp'),
(87, 'titania@ustp.cdo', 'gnarly', 'Titania', '-', 'McPherran', '2025-04-21', '09123456789', '', '', '', '', '', '683c0f9751c2d_titania1.png'),
(88, 'magik@ustp.cdo', 'gnarly', 'Illyana', '-', 'Rasputin', '2025-04-22', '09123456789', '', '', '', '', '', '683c0fe5f3108_magik3.png'),
(89, 'psylocke@ustp.cdo', 'ganrly', 'Elizabeth', 'Betsy', 'Braddock', '2025-06-12', '09192648751', '', '', '', '', '', '683c101b56ab1_psylocke4.png'),
(90, 'redqueen@ustp.cdo', 'gnarly', 'Kitty', '-', 'Pryde', '2025-06-04', '092346537403', '', '', '', '', '', '683c10426e3dd_kittypryde1.png'),
(91, 'iceman@ustp.cdo', 'gnarly', 'Bobby', '-', 'Drake', '2025-05-28', '09192648751', '', '', '', '', '', 'student_683c1d08c350f_iceman2.png'),
(92, 'aero@ustp.cdo', 'gnarly', 'Lei', '-', 'Ling', '2025-05-14', '092346537403', '', '', '', '', '', '683c109be8385_aero1.png'),
(93, 'moonstone@ustp.cdo', 'gnarly', 'Karla', 'Moonstone', 'Soften', '2025-05-07', '09262103722', '', '', '', '', '', '683c10d739fd3_moonstone.png'),
(94, 'medusa@ustp.cdo', 'gnarly', 'Medusa', '-', 'Amaquelin', '2025-05-14', '09192648751', '', '', '', '', '', '683c11027e48f_medusa2.png'),
(95, 'rogue@ustp.cdo', 'gnarly', 'Anna', 'Marie', 'LeBeau', '2025-05-13', '09192648751', '', '', '', '', '', '683c1146e2f22_rogue3.png'),
(96, 'sharonrogers@ustp.cdo', 'gnarly', 'Sharon', 'Carter', 'Rogers', '2025-05-06', '09192648751', '', '', '', '', '', '683c1177e5602_sharonrogers6.png'),
(97, 'blackwidow@ustp.cdo', 'gnarly', 'Natasha', '-', 'Romanoff', '2025-05-14', '09123456789', '', '', '', '', '', '683c11e07c0d6_blackwidow11.png'),
(98, 'starlord@ustp.cdo', 'gnarly', 'Peter', 'Jason', 'Quill', '2025-05-07', '09192648751', '', '', '', '', '', '683c135b9b545_Star-Lord_Uniform_IIIII.webp'),
(99, 'adamwarlock@ustp.cdo', 'gnarly', 'Adam', '-', 'Warlock', '2025-04-01', '092346537403', '', '', '', '', '', '683c138767908_Adam_Warlock_Uniform_II.webp'),
(100, 'spiderwoman@ustp.cdo', 'gnarly', 'Jessica', '-', 'Draw', '2025-05-07', '09192648751', '', '', '', '', '', '683c13c2f3ceb_Spider-Woman_Uniform_II.webp'),
(101, 'sistergrimm@ustp.cdo', 'gnarly', 'Nico', '-', 'Minoru', '2025-05-13', '092346537403', '', '', '', '', '', '683c1a548eba2_Sister_Grimm_Uniform_II.webp'),
(102, 'deadpool@ustp.cdo', 'gnarly', 'Wade', 'Winston', 'Wilson', '2025-05-05', '092346537403', '', '', '', '', '', '683c1431662da_Deadpool_Uniform_IIIIIIII.webp'),
(103, 'swordmaster@ustp.cdo', 'gnarly', 'Lin', '-', 'Lei', '2025-05-06', '09192648751', '', '', '', '', '', '683c146798edc_Sword_Master_Uniform_I.webp'),
(104, 'storm@ustp.cdo', 'gnarly', 'Ororo', '-', 'Munroe', '2025-04-22', '09192648751', '', '', '', '', '', '683c14979e144_Storm_Uniform_II.webp'),
(105, 'spectrum@ustp.cdo', 'gnarly', 'Monica', '-', 'Rambeau', '2025-05-13', '09262103722', '', '', '', '', '', '683c14c472d31_Spectrum_Uniform_I.webp'),
(106, 'whitefox@ustp.cdo', 'gnarly', 'Ami', '-', 'Han', '2025-05-13', '092346537403', '', '', '', '', '', '683c14fca4ab8_White_Fox_Uniform_II.webp'),
(107, 'dazzler@ustp.cdo', 'gnarly', 'Alison', '-', 'Blaire', '2025-05-06', '092346537403', '', '', '', '', '', '683c1531b870b_DazzlerIcon.webp'),
(108, 'whitewidow@ustp.cdo', 'gnarly', 'Yelena', '-', 'Belova', '2025-05-06', '09192648751', '', '', '', '', '', '683c157fd55ae_Yelena_Belova_Uniform_III.png'),
(109, 'wave@ustp.cdo', 'gnarly', 'Pearl', '-', 'Pangan', '2025-05-06', '09192648751', '', '', '', '', '', '683c15dceea4d_Wave_Uniform_I.png'),
(110, 'sentry@ustp.cdo', 'gnarly', 'Robert', '-', 'Reynolds', '2025-05-06', '09192648751', '', '', '', '', '', '683c1628102f6_Sentry_Uniform_II.png'),
(111, 'msmarvel@ustp.cdo', 'gnarly', 'Kamala', '-', 'Khan', '2025-04-22', '09262103722', '', '', '', '', '', '683c165083f5a_Ms._Marvel__28Kamala_Khan_29_Uniform_IIII.png'),
(112, 'lunasnow@ustp.cdo', 'gnarly', 'Seol', 'Luna', 'Hee', '2025-05-21', '09192648751', '', '', '', '', '', '683c17264912b_Luna_Snow_Uniform_III.png'),
(113, 'invisiblewoman@ustp.cdo', 'ganrly', 'Susan', 'Storm', 'Richards', '2025-05-15', '09262103722', '', '', '', '', '', '683c180055abd_Invisible_Woman_Uniform_III.png'),
(114, 'humantorch@ustp.cdo', 'gnarly', 'Jonathan', 'Lowell', 'Storm', '2025-05-14', '09192648751', '', '', '', '', '', '683c183024e0e_Human_Torch_Uniform_III.png'),
(115, 'whitequeen@ustp.cdo', 'gnarly', 'Emma', 'Grace', 'Frost', '2025-05-07', '09192648751', '', '', '', '', '', '683c185a79926_Emma_Frost_Uniform_III.png'),
(116, 'ghost@ustp.cdo', 'gnarly', 'Ava', '-', 'Starr', '2025-05-07', '09192648751', '', '', '', '', '', '683c18a9b23f9_Ghost_Uniform_II.png'),
(117, 'captainmarvel@ustp.cdo', 'gnarly', 'Carol', 'Susan', 'Danvers', '2025-05-14', '09123456789', '', '', '', '', '', '683c18d3e8215_Captain_Marvel_Uniform_IIIIII.png'),
(118, 'arthur@ustp.cdo', 'gnarly', 'Arthur', 'Mafia', 'Gomez', '2002-03-20', '09171234567', '', '', '', '', '', '683c595b63efa_1.png'),
(119, 'dong@ustp.cdo', 'gnarly', 'Dodong', 'Cortez', 'Torres', '2005-05-05', '09087654321', '', '', '', '', '', '683c5a01635b2_2.png'),
(120, 'alejandro@ustp.cdo', 'gnarly', 'Alejandro', 'Pilak', 'Diaz', '2003-06-12', '09990123456', '', '', '', '', '', '683c5a8099161_3.png'),
(121, 'frans@ustp.cdo', 'ganrly', 'Frans', 'Pilak', 'Diaz', '2003-06-12', '09228765432', '', '', '', '', '', '683c5b039a758_4.png'),
(122, 'gorge@ustp.cdo', 'gnarly', 'Gorge', 'Soul', 'Rivera', '2004-08-04', '09331112233', '', '', '', '', '', '683c5bb06cdc5_5.png'),
(123, 'miguel@ustp.cdo', 'gnarly', 'Miguel', 'Arturo', 'Flores', '2004-10-02', '09459876543', '', '', '', '', '', '683c5c5f59904_6.png'),
(124, 'rogin@ustp.cdo', 'gnarly', 'Rogin', 'Uba', 'Lagrosas', '2004-10-01', '09084460913', '', '', '', '', '', '683c5ce1b2d3e_7.png'),
(125, 'lance@ustp.cdo', 'ganrly', 'Lance', 'Dutor', 'Salazar', '2002-09-17', '09667890123', '', '', '', '', '', '683c5e5f64a96_8.png'),
(126, 'pilar@ustp.cdo', 'gnarly', 'Pilar', 'Guamo', 'Vintura', '2001-11-26', '09774567890', '', '', '', '', '', '683c60bdd3c44_9.png'),
(127, 'isla@ustp.cdo', 'gnarly', 'Isla', 'Pintig', 'Mendoza', '2004-03-10', '09071002000', '', '', '', '', '', '683c61274808e_10.png'),
(128, 'dexter@ustp.cdo', 'gnarly', 'Dexter', 'Gimenez', 'Gomez', '2004-09-30', '09183334455', '', '', '', '', '', '683c61d2640d5_11.png'),
(129, 'bam@ustp.cdo', 'gnarly', 'Bam', '-', 'Aquino', '2003-07-05', '09286789012', '', '', '', '', '', '683c6280a1da4_ (4).png'),
(130, 'alejandra@ustp.cdo', 'gnarly', 'Alexandra Therese', 'Posh', 'Sy', '2004-02-05', '09395556677', '', '', '', '', '', '683c631563290_ (5).png'),
(131, 'victor@ustp.cdo', 'gnarly', 'Victor', 'Dra', 'Culas', '2001-10-04', '09479998877', '', '', '', '', '', '683c63945c3e2_ (6).png'),
(132, 'roselia@ustp.cdo', 'gnarly', 'Roselia', 'Scent', 'White', '2004-02-01', '09286789012', '', '', '', '', '', '683c65ea9c167_ (7).png'),
(133, 'pharina@ustp.cdo', 'gnarly', 'Pharina ', 'Cortez', 'Salazar', '2003-03-02', '09395556677', '', '', '', '', '', '683c6657b96f8_ (8).png'),
(134, 'lesley@ustp.cdo', 'gnarly', 'Lesley', 'Sulfur', 'Heckler', '2001-07-07', '09479998877', '', '', '', '', '', '683c674d6eeb2_ (9).png'),
(135, 'firlia@ustp.cdo', 'gnarly', 'Firlia', 'Horn', 'Kertin', '2004-07-02', '09062223344', '', '', '', '', '', '683c67d902418_ (10).png'),
(136, 'mariposa@ustp.cdo', 'gnarly', 'Mariposa', 'Scarlet', 'Moon', '2002-06-21', '09158889900', '', '', '', '', '', '683c6854db29c_ (11).png'),
(137, 'zola@ustp.cdo', 'gnarly', 'Zola', 'Fresco', 'Stone', '2004-06-23', '09090001122', '', '', '', '', '', '683c68f256c31_ (12).png'),
(138, 'isa@ustp.cdo', 'gnarly', 'Isa', 'Santos', 'Dela Cruz', '2003-07-12', '09171234567', '', '', '', '', '', '683c6dac161ca_1.png'),
(139, 'noah@ustp.cdo', 'gnarly', 'Noah', 'Ryan', 'Kim', '2004-03-25', '09087654321', '', '', '', '', '', '683c6e3ec4a51_2.png'),
(140, 'ava@ustp.cdo', 'gnarly', 'Ava', 'Grace', 'Sharma', '2002-09-12', '09990123456', '', '', '', '', '', '683c6f1d239ee_3.png'),
(141, 'liam@ustp.cdo', 'gnarly', 'Liam', 'David', 'Rodriguez', '2003-11-18', '09228765432', '', '', '', '', '', '683c6f81462d3_4.png'),
(142, 'sophia@ustp.cdo', 'gnarly', 'Sophia', 'Marie', 'Schmidt', '2005-04-30', '09331112233', '', '', '', '', '', '683c7033c95eb_5.png'),
(143, 'luna@ustp.cdo', 'gnarly', 'Luna', 'Ivy', 'Hayes', '2003-10-07', '09459876543', '', '', '', '', '', '683c714cf0cc1_6.png'),
(144, 'mia@ustp.cdo', 'gnarly', 'Mia', 'Rose', 'Dubois', '2004-06-20', '09052345678', '', '', '', '', '', '683c71b37009a_7.png'),
(145, 'chloe@ustp.cdo', 'gnarly', 'Chloe', 'Jade', 'Taylor', '2002-10-14', '09667890123', '', '', '', '', '', '683c721df3f39_8.png'),
(146, 'leomord@ustp.cdo', 'gnarly', 'Leomord', 'Knight', 'Strong', '2004-01-02', '09074990919', '', '', '', '', '', '683c78642aec1_1.png'),
(147, 'twinkle@ustp.cdo', 'gnarly', 'Twinkle', 'Midnight', 'Bloom', '2003-02-22', '09191112233', '', '', '', '', '', '683c78c573f21_2.png'),
(148, 'shania@ustp.cdo', 'gnarly', 'Shania', 'Gomez', 'Karma', '2001-03-31', '09085556677', '', '', '', '', '', '683c792fe7cee_3.png'),
(149, 'dylan@ustp.cdo', 'gnarly', 'Dylan', 'Smith', 'Wang', '2004-06-09', '09989990011', '', '', '', '', '', '683c798c50b7f_4.png'),
(150, 'marie@ustp.cdo', 'gnarly', 'Marie', 'Antonette', 'Elizabeth', '2001-04-24', '09273334455', '', '', '', '', '', '683c79eb63138_5.png'),
(151, 'fiero@ustp.cdo', 'gnarly', 'Fiero', 'Ice', 'Willam', '2004-07-16', '09386667788', '', '', '', '', '', '683c7a54759f8_6.png'),
(152, 'ariana@ustp.cdo', 'gnarly', 'Ariana', 'Grande', 'Swarovski', '2004-06-04', '09490001122', '', '', '', '', '', '683c7aac7a253_7.png'),
(153, 'emily@ustp.cdo', 'gnarly', 'Emily', 'Centauri', 'Star', '2004-09-12', '09062223344', '', '', '', '', '', '683c7b06840f1_8.png'),
(154, 'katrina@ustp.cdo', 'gnarly', 'Katrina', 'Leondra', 'Curtis', '2004-09-19', '09167778899', '', '', '', '', '', '683c7b8360687_9.png'),
(155, 'freya@ustp.cdo', 'gnarly', 'Freya', 'Golden', 'Crestwood', '2004-10-10', '09294445566', '', '', '', '', '', '683c7c2665902_10.png'),
(156, 'ningning@ustp.cdo', 'gnarly', 'Ningning', 'Sea', 'Aespa', '2004-01-16', '09308889900', '', '', '', '', '', '683c7c96f1ee0_11.png'),
(157, 'floryn@ustp.cdo', 'gnarly', 'Floryn', 'Mendoza', 'Willow', '2004-06-21', '09471112233', '', '', '', '', '', '683c7cf7f12b1_12.png'),
(158, 'aamon@ustp.cdo', 'gnarly', 'Aamon', 'Marksman', 'Sharp', '2004-05-09', '09053334455', '', '', '', '', '', '683c7d5d4a999_13.png'),
(159, 'gusion@ustp.cdo', 'gnarly', 'Gusion', 'Clemont', 'Evermore', '2004-07-13', '09186667788', '', '', '', '', '', '683c7dc0a4ddd_14.png'),
(160, 'chou@ustp.cdo', 'gnarly', 'Chou', 'Brick', 'Fonte', '2004-08-06', '09209990011', '', '', '', '', '', '683c7e59cdfb0_15.png'),
(161, 'anubis@ustp.cdo', 'gnarly', 'Anubis', 'Moon', 'Romanov', '2004-04-29', '09342223344', '', '', '', '', '', '683c7ee4e393d_16.png'),
(162, 'valir@ustp.cdo', 'gnarly', 'Valir', 'Combust', 'Fiery', '2004-10-05', '09435556677', '', '', '', '', '', '683c7f3a255dd_17.png'),
(163, 'peter@ustp.cdo', 'gnarly', 'Peter', 'Webb', 'Parker', '2004-04-26', '09037778899', '', '', '', '', '', '683c7f9165be7_18.png'),
(164, 'chris@ustp.cdo', 'gnarly', 'Chris ', '-', 'Alonzo', '2004-03-22', '09120001122', '', '', '', '', '', '683c7fea15356_19.png'),
(165, 'eric@ustp.cdo', 'gnarly', 'Eric', '-', 'Charming', '2004-09-10', '09213334455', '', '', '', '', '', '683c8040b277b_20.png'),
(166, 'melani@ustp.cdo', 'gnarly', 'Melani', '-', 'Martinez', '2004-10-07', '09061234567', '', '', '', '', '', '683c83b95db7e_1.png'),
(167, 'sunny@ustp.cdo', 'gnarly', 'Sunny', 'Cortez', 'Gomez', '2004-07-04', '09189876543', '', '', '', '', '', '683c841f65784_2.png'),
(168, 'coby@ustp.cdo', 'gnarly', 'Coby', '-', 'Duran', '2004-06-01', '09992345678', '', '', '', '', '', '683c847ee3c77_3.png'),
(169, 'todoroki@ustp.cdo', 'gnarly', 'Todoroki', 'Fire', 'Ice', '2004-03-09', '09278765432', '', '', '', '', '', '683c84d90c38a_4.png'),
(170, 'sam@ustp.cdo', 'gnarly', 'Sam', 'Gomez', 'Pangilinan', '2004-05-12', '09351112233', '', '', '', '', '', '683c852d5bd0c_5.png'),
(171, 'france@ustp.cdo', 'gnarly', 'France', '-', 'De Castro', '2004-07-26', '09489998877', '', '', '', '', '', '683c85833c875_6.png'),
(172, 'maui@ustp.cdo', 'gnarly', 'Maui', 'Ocean', 'Demi', '2004-06-02', '09072345678', '', '', '', '', '', '683c85d5d5e90_7.png'),
(173, 'naveen@ustp.cdo', 'gnarly', 'Naveen', '-', 'Maldonia', '2004-04-03', '09687890123', '', '', '', '', '', '683c863cc4f59_8.png'),
(174, 'novaria@ustp.cdo', 'gnarly', 'Novaria', 'Solemn', 'Sky', '2004-07-02', '09794567890', '', '', '', '', '', '683c869ba5baf_9.png'),
(175, 'arlott@ustp.cdo', 'ganrly', 'Arlott', 'Swing', 'Ferrer', '2004-05-08', '09051002000', '', '', '', '', '', '683c8712180c7_10.png'),
(176, 'jaekyung@ustp.cdo', 'gnarly', 'Jaekyung', 'Big', 'Saber', '2004-10-11', '09173334455', '', '', '', '', '', '683c8777368af_11.png'),
(177, 'badang@ustp.cdo', 'gnarly', 'Badang', 'Punch', 'Anderson', '2004-07-30', '09286789012', '', '', '', '', '', '683c880523241_12.png'),
(178, 'cream@ustp.cdo', 'gnarly', 'Cream', 'Puff', 'Robinson', '2004-06-02', '09395556677', '', '', '', '', '', '683c88716403f_13.png'),
(179, 'aurora@ustp.cdo', 'gnarly', 'Aurora', 'Flakes', 'Winter', '2004-09-10', '09479998877', '', '', '', '', '', '683c88dacfeca_15.png'),
(180, 'sabrina@ustp.cdo', 'gnarly', 'Sabrina', 'Roan', 'Thompson', '2004-06-02', '09062223344', '', '', '', '', '', '683c8938ea3b4_14.png'),
(181, 'lylia@ustp.cdo', 'gnarly', 'Lylia', 'Shadow', 'Starfall', '2004-04-03', '09158889900', '', '', '', '', '', '683c89ad0e077_16.png'),
(182, 'goldy@ustp.cdo', 'gnarly', 'Goldy', '-', 'Munch', '2004-09-02', '09201112233', '', '', '', '', '', '683c89fdebf08_17.png'),
(183, 'moon@ustp.cdo', 'gnarly', 'Moon', 'France', 'Silvertree', '2004-05-18', '09304445566', '', '', '', '', '', '683c8a6d3a1fa_18.png'),
(184, 'genevieve@ustp.cdo', 'gnarly', 'Genevieve', '-', 'Starling', '2004-10-05', '09467778899', '', '', '', '', '', '683c8afbdb3a0_19.png'),
(185, 'rosalind@ustp.cdo', 'gnarly', 'Rosalind', 'Vance', 'Monroe', '2004-02-01', '09090001122', '', '', '', '', '', '683c8b6273a4f_20.png'),
(186, 'luffy.d.monkey@ustp.cdo', 'gnarly', 'Monkey', 'Ace', 'Luffy', '2002-05-05', '09123456781', 'East Blue Street', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(187, 'uzumaki.naruto@ustp.cdo', 'gnarly', 'Naruto', 'Minato', 'Uzumaki', '2001-10-10', '09123456782', 'Leaf Village Road', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(188, 'zoldyck.killua@ustp.cdo', 'gnarly', 'Killua', 'Illumi', 'Zoldyck', '2005-07-07', '09123456783', 'Zeburu Drive', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(189, 'kamado.tanjiro@ustp.cdo', 'gnarly', 'Tanjiro', 'Takeshi', 'Kamado', '2003-06-06', '09123456784', 'Hinokami St.', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(190, 'gojo.satoru@ustp.cdo', 'gnarly', 'Satoru', 'Reiji', 'Gojo', '1999-12-24', '09123456785', 'Jujutsu High Avenue', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(191, 'itadori.yuji@ustp.cdo', 'gnarly', 'Yuji', 'Kento', 'Itadori', '2004-03-20', '09123456786', 'Shibuya Line', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(192, 'aizawa.shouta@ustp.cdo', 'gnarly', 'Shouta', 'Keiji', 'Aizawa', '1990-11-08', '09123456787', 'U.A. Campus', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(193, 'lee.rock@ustp.cdo', 'gnarly', 'Rock', 'Might', 'Lee', '2002-01-08', '09123456788', 'Taijutsu St.', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(194, 'yagami.light@ustp.cdo', 'gnarly', 'Light', 'Soichiro', 'Yagami', '2000-02-28', '09123456789', 'Kira Lane', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(195, 'lelouch.vi@ustp.cdo', 'gnarly', 'Lelouch', 'Lamperouge', 'Britannia', '1998-12-05', '09123456790', 'Geass Blvd', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(196, 'jaeger.eren@ustp.cdo', 'gnarly', 'Eren', 'Grisha', 'Jaeger', '2001-03-30', '09123456791', 'Paradise Island Rd.', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(197, 'mikasa.ackerman@ustp.cdo', 'gnarly', 'Mikasa', 'Erika', 'Ackerman', '2001-02-10', '09123456792', 'Shiganshina St.', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(198, 'yuno.grinberryall@ustp.cdo', 'gnarly', 'Yuno', 'Rein', 'Grinberryall', '2004-09-17', '09123456793', 'Clover Kingdom Way', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(199, 'jin.mori@ustp.cdo', 'gnarly', 'Mori', 'Han', 'Jin', '2003-08-01', '09123456794', 'God of Highschool Lane', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(200, 'baam.tower@ustp.cdo', 'gnarly', 'Baam', 'Khun', 'Twenty-Fifth', '2004-04-04', '09123456795', 'Tower Pathway', 'CDO', 'Misamis Oriental', '9000', 'Philippines', NULL),
(201, 'aqua.hoshino@ustp.cdo', 'gnarly', 'Aqua', 'Ren', 'Hoshino', '2003-01-01', '09171234560', 'Shibuya St.', 'Cagayan de Oro', 'Misamis Oriental', '9000', 'Philippines', NULL),
(202, 'ai.hoshino@ustp.cdo', 'gnarly', 'Ai', 'Rika', 'Hoshino', '2002-05-10', '09179874563', 'Idol Avenue', 'Iligan', 'Lanao del Norte', '9000', 'Philippines', NULL),
(203, 'loid.forger@ustp.cdo', 'gnarly', 'Loid', 'Kean', 'Forger', '1998-10-20', '09173456782', 'Spy St.', 'Davao', 'Davao del Sur', '9000', 'Philippines', NULL),
(204, 'yor.briar@ustp.cdo', 'gnarly', 'Yor', 'Faye', 'Briar', '1999-12-05', '09175671234', 'Garden Path', 'Valencia', 'Bukidnon', '9000', 'Philippines', NULL),
(205, 'anya.forger@ustp.cdo', 'gnarly', 'Anya', 'Belle', 'Forger', '2007-03-03', '09172345678', 'Peanut St.', 'Butuan', 'Agusan del Norte', '9000', 'Philippines', NULL),
(206, 'aizawa.shouta@ustp.cdo', 'gnarly', 'Shouta', 'Eli', 'Aizawa', '1990-11-11', '09179991111', 'Eraserhead Ln.', 'Cebu', 'Cebu', '9000', 'Philippines', NULL),
(207, 'hawks.keigo@ustp.cdo', 'gnarly', 'Keigo', 'Jude', 'Hawks', '1998-09-15', '09170001122', 'Wing Road', 'Baguio', 'Benguet', '9000', 'Philippines', NULL),
(208, 'dazai.osamu@ustp.cdo', 'gnarly', 'Osamu', 'Grey', 'Dazai', '1996-06-19', '09173334455', 'Detective Blvd.', 'Marawi', 'Lanao del Sur', '9000', 'Philippines', NULL),
(209, 'chuuya.nakahara@ustp.cdo', 'gnarly', 'Chuuya', 'Knox', 'Nakahara', '1996-07-20', '09172226677', 'Gravity St.', 'Tagum', 'Davao del Norte', '9000', 'Philippines', NULL),
(210, 'kaguya.shinomiya@ustp.cdo', 'gnarly', 'Kaguya', 'Rin', 'Shinomiya', '2001-04-04', '09170002345', 'Elite Circle', 'Gingoog', 'Misamis Oriental', '9000', 'Philippines', NULL),
(211, 'miyuki.shirogane@ustp.cdo', 'gnarly', 'Miyuki', 'Thane', 'Shirogane', '2000-12-12', '09173335577', 'Council Rd.', 'Malaybalay', 'Bukidnon', '9000', 'Philippines', NULL),
(212, 'yoruichi.shihouin@ustp.cdo', 'gnarly', 'Yoruichi', 'Skye', 'Shihouin', '1995-05-05', '09174445522', 'Flash Lane', 'Pagadian', 'Zamboanga del Sur', '9000', 'Philippines', NULL),
(213, 'rukia.kuchiki@ustp.cdo', 'gnarly', 'Rukia', 'Hope', 'Kuchiki', '1997-07-07', '09172221144', 'Soul Blvd.', 'Surigao', 'Surigao del Norte', '9000', 'Philippines', NULL),
(214, 'ichigo.kurosaki@ustp.cdo', 'gnarly', 'Ichigo', 'Noel', 'Kurosaki', '1997-01-15', '09176669900', 'Zangetsu Alley', 'Ozamiz', 'Misamis Occidental', '9000', 'Philippines', NULL),
(215, 'rukuro.enmado@ustp.cdo', 'gnarly', 'Rukuro', 'Ash', 'Enmado', '1999-08-08', '09174446688', 'Twin Star Rd.', 'Koronadal', 'South Cotabato', '9000', 'Philippines', NULL),
(216, 'mitsukikonno@ustp.cdo', 'gnarly', 'Mitsuki', 'Hana', 'Konno', '2002-04-12', '09123456711', 'Riverbend St.', 'Sapporo', 'Hokkaido', '9000', 'Philippines', NULL),
(217, 'iwaizumi@ustp.cdo', 'gnarly', 'Hajime', 'Ren', 'Iwaizumi', '2001-09-17', '09123456712', 'Volleyball Ave', 'Sendai', 'Miyagi', '9000', 'Philippines', NULL),
(218, 'kyotani@ustp.cdo', 'gnarly', 'Kentaro', 'Zeke', 'Kyotani', '2002-06-23', '09123456713', 'Mad Dog Lane', 'Sendai', 'Miyagi', '9000', 'Philippines', NULL),
(219, 'hikarihoraki@ustp.cdo', 'gnarly', 'Hikari', 'Eri', 'Horaki', '2003-02-19', '09123456714', 'Evangelion Blvd', 'Tokyo-3', 'Tokyo', '9000', 'Philippines', NULL),
(220, 'mayaibuki@ustp.cdo', 'gnarly', 'Maya', 'Yuki', 'Ibuki', '2001-12-30', '09123456715', 'Command Center Rd.', 'Tokyo-3', 'Tokyo', '9000', 'Philippines', NULL),
(221, 'shinoaburame@ustp.cdo', 'gnarly', 'Shino', 'Kouji', 'Aburame', '2000-10-09', '09123456716', 'Bug Path', 'Konoha', 'Hi no Kuni', '9000', 'Philippines', NULL),
(222, 'moegi@ustp.cdo', 'gnarly', 'Moegi', 'Rina', 'Kazamatsuri', '2003-03-28', '09123456717', 'Leaf Lane', 'Konoha', 'Hi no Kuni', '9000', 'Philippines', NULL),
(223, 'rikoayanami@ustp.cdo', 'gnarly', 'Riko', 'Tama', 'Ayanami', '2002-08-01', '09123456718', 'Depth Street', 'Orth', 'Abyssal Region', '9000', 'Philippines', NULL),
(224, 'millyashford@ustp.cdo', 'gnarly', 'Milly', 'Sera', 'Ashford', '2001-07-05', '09123456719', 'Student Council Rd.', 'Tokyo Settlement', 'Area 11', '9000', 'Philippines', NULL),
(225, 'sayaotoin@ustp.cdo', 'gnarly', 'Saya', 'Lumi', 'Otoin', '2004-11-16', '09123456720', 'Blue Flame St.', 'Shinjuku', 'Tokyo', '9000', 'Philippines', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_details`
--

CREATE TABLE `student_details` (
  `student_details_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `section_course_id` bigint DEFAULT NULL,
  `program_details_id` bigint DEFAULT NULL,
  `admin_id` bigint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_details`
--

INSERT INTO `student_details` (`student_details_id`, `student_id`, `section_course_id`, `program_details_id`, `admin_id`) VALUES
(117, 45, 55, 1, 1),
(118, 45, 56, 1, 1),
(119, 45, 57, 1, 1),
(120, 45, 59, 1, 1),
(121, 45, 58, 1, 1),
(122, 46, 55, 1, 1),
(123, 46, 56, 1, 1),
(124, 46, 57, 1, 1),
(125, 46, 59, 1, 1),
(127, 47, 55, 1, 1),
(128, 47, 56, 1, 1),
(129, 47, 57, 1, 1),
(130, 47, 59, 1, 1),
(131, 48, 55, 1, 1),
(132, 48, 56, 1, 1),
(133, 48, 57, 1, 1),
(134, 48, 59, 1, 1),
(135, 48, 58, 1, 1),
(136, 49, 55, 1, 1),
(137, 49, 56, 1, 1),
(138, 49, 57, 1, 1),
(139, 49, 59, 1, 1),
(140, 49, 58, 1, 1),
(141, 50, 55, 1, 1),
(142, 50, 56, 1, 1),
(143, 50, 57, 1, 1),
(144, 50, 59, 1, 1),
(145, 50, 58, 1, 1),
(146, 51, 55, 1, 1),
(147, 51, 56, 1, 1),
(148, 51, 57, 1, 1),
(149, 51, 59, 1, 1),
(150, 51, 58, 1, 1),
(151, 52, 56, 1, 1),
(152, 52, 55, 1, 1),
(153, 52, 57, 1, 1),
(154, 52, 59, 1, 1),
(155, 52, 58, 1, 1),
(156, 53, 55, 1, 1),
(157, 53, 56, 1, 1),
(158, 53, 57, 1, 1),
(159, 53, 58, 1, 1),
(160, 53, 59, 1, 1),
(161, 54, 55, 1, 1),
(162, 54, 56, 1, 1),
(163, 54, 57, 1, 1),
(164, 54, 59, 1, 1),
(165, 54, 58, 1, 1),
(166, 55, 55, 1, 1),
(167, 55, 56, 1, 1),
(168, 55, 57, 1, 1),
(169, 55, 59, 1, 1),
(170, 55, 58, 1, 1),
(171, 56, 55, 1, 1),
(172, 56, 56, 1, 1),
(173, 56, 57, 1, 1),
(174, 56, 59, 1, 1),
(175, 56, 58, 1, 1),
(176, 56, 83, 1, 1),
(177, 57, 55, 1, 1),
(178, 57, 56, 1, 1),
(179, 57, 57, 1, 1),
(180, 57, 59, 1, 1),
(181, 57, 58, 1, 1),
(182, 57, 83, 1, 1),
(183, 58, 55, 1, 1),
(184, 58, 56, 1, 1),
(185, 58, 57, 1, 1),
(186, 58, 59, 1, 1),
(187, 58, 58, 1, 1),
(188, 58, 83, 1, 1),
(189, 59, 55, 1, 1),
(190, 59, 56, 1, 1),
(191, 59, 57, 1, 1),
(192, 59, 59, 1, 1),
(193, 59, 58, 1, 1),
(194, 59, 83, 1, 1),
(195, 60, 55, 1, 1),
(196, 60, 56, 1, 1),
(197, 60, 57, 1, 1),
(198, 60, 59, 1, 1),
(199, 60, 58, 1, 1),
(200, 60, 83, 1, 1),
(201, 61, 56, 1, 1),
(202, 61, 55, 1, 1),
(203, 61, 57, 1, 1),
(204, 61, 59, 1, 1),
(205, 61, 58, 1, 1),
(206, 61, 83, 1, 1),
(207, 62, 55, 1, 1),
(208, 62, 56, 1, 1),
(209, 62, 57, 1, 1),
(210, 62, 59, 1, 1),
(211, 62, 58, 1, 1),
(212, 62, 83, 1, 1),
(213, 63, 75, 2, 1),
(214, 63, 78, 2, 1),
(215, 63, 76, 2, 1),
(216, 63, 77, 2, 1),
(217, 64, 75, 2, 1),
(218, 64, 78, 2, 1),
(219, 64, 76, 2, 1),
(220, 64, 77, 2, 1),
(221, 65, 75, 2, 1),
(222, 65, 78, 2, 1),
(223, 65, 76, 2, 1),
(224, 65, 77, 2, 1),
(225, 66, 75, 2, 1),
(226, 66, 78, 2, 1),
(227, 66, 76, 2, 1),
(228, 66, 77, 2, 1),
(229, 67, 75, 2, 1),
(230, 67, 78, 2, 1),
(231, 67, 76, 2, 1),
(232, 67, 77, 2, 1),
(233, 68, 75, 2, 1),
(234, 68, 78, 2, 1),
(235, 68, 76, 2, 1),
(236, 68, 77, 2, 1),
(237, 69, 75, 2, 1),
(238, 69, 78, 2, 1),
(239, 69, 76, 2, 1),
(240, 69, 77, 2, 1),
(241, 70, 75, 2, 1),
(242, 70, 78, 2, 1),
(243, 70, 76, 2, 1),
(244, 70, 77, 2, 1),
(245, 71, 75, 2, 1),
(246, 71, 78, 2, 1),
(247, 71, 76, 2, 1),
(248, 72, 75, 2, 1),
(249, 72, 78, 2, 1),
(250, 72, 76, 2, 1),
(251, 72, 77, 2, 1),
(252, 73, 75, 2, 1),
(253, 73, 78, 2, 1),
(254, 73, 76, 2, 1),
(255, 73, 77, 2, 1),
(256, 74, 75, 2, 1),
(257, 74, 78, 2, 1),
(258, 74, 76, 2, 1),
(259, 74, 77, 2, 1),
(260, 75, 98, 3, 1),
(261, 75, 99, 3, 1),
(262, 75, 95, 3, 1),
(263, 75, 96, 3, 1),
(264, 75, 97, 3, 1),
(265, 76, 98, 3, 1),
(266, 76, 99, 3, 1),
(267, 76, 95, 3, 1),
(268, 76, 96, 3, 1),
(269, 76, 97, 3, 1),
(270, 77, 98, 3, 1),
(271, 77, 99, 3, 1),
(272, 77, 95, 3, 1),
(273, 77, 96, 3, 1),
(274, 77, 97, 3, 1),
(275, 78, 98, 3, 1),
(276, 78, 99, 3, 1),
(277, 78, 95, 3, 1),
(278, 78, 96, 3, 1),
(279, 78, 97, 3, 1),
(280, 79, 98, 3, 1),
(281, 79, 99, 3, 1),
(282, 79, 95, 3, 1),
(283, 79, 96, 3, 1),
(284, 79, 97, 3, 1),
(285, 80, 98, 3, 1),
(286, 80, 95, 3, 1),
(287, 80, 99, 3, 1),
(288, 80, 96, 3, 1),
(289, 80, 97, 3, 1),
(290, 81, 98, 3, 1),
(291, 81, 99, 3, 1),
(292, 81, 95, 3, 1),
(293, 81, 96, 3, 1),
(294, 81, 97, 3, 1),
(295, 82, 98, 3, 1),
(296, 82, 99, 3, 1),
(297, 82, 95, 3, 1),
(298, 82, 96, 3, 1),
(299, 82, 97, 3, 1),
(300, 83, 98, 3, 1),
(301, 83, 99, 3, 1),
(302, 83, 95, 3, 1),
(303, 83, 96, 3, 1),
(304, 83, 97, 3, 1),
(305, 84, 99, 3, 1),
(306, 84, 98, 3, 1),
(307, 84, 95, 3, 1),
(308, 84, 96, 3, 1),
(309, 84, 97, 3, 1),
(310, 85, 98, 3, 1),
(311, 85, 99, 3, 1),
(312, 85, 95, 3, 1),
(313, 85, 96, 3, 1),
(314, 85, 97, 3, 1),
(315, 86, 98, 3, 1),
(316, 86, 99, 3, 1),
(317, 86, 95, 3, 1),
(318, 86, 96, 3, 1),
(319, 86, 97, 3, 1),
(320, 87, 98, 3, 1),
(321, 87, 99, 3, 1),
(322, 87, 95, 3, 1),
(323, 87, 96, 3, 1),
(324, 87, 97, 3, 1),
(325, 88, 98, 3, 1),
(326, 88, 99, 3, 1),
(327, 88, 95, 3, 1),
(328, 88, 96, 3, 1),
(329, 88, 97, 3, 1),
(330, 89, 98, 3, 1),
(331, 89, 99, 3, 1),
(332, 89, 95, 3, 1),
(333, 89, 96, 3, 1),
(334, 89, 97, 3, 1),
(335, 90, 98, 3, 1),
(336, 90, 99, 3, 1),
(337, 90, 95, 3, 1),
(338, 90, 96, 3, 1),
(339, 90, 97, 3, 1),
(340, 91, 98, 3, 1),
(341, 91, 99, 3, 1),
(342, 91, 95, 3, 1),
(343, 91, 96, 3, 1),
(344, 91, 97, 3, 1),
(345, 92, 98, 3, 1),
(346, 92, 99, 3, 1),
(347, 92, 95, 3, 1),
(348, 92, 96, 3, 1),
(349, 92, 97, 3, 1),
(350, 93, 98, 3, 1),
(351, 93, 99, 3, 1),
(352, 93, 95, 3, 1),
(353, 93, 96, 3, 1),
(354, 93, 97, 3, 1),
(355, 94, 99, 3, 1),
(356, 94, 98, 3, 1),
(357, 94, 95, 3, 1),
(358, 94, 96, 3, 1),
(359, 94, 97, 3, 1),
(360, 95, 98, 3, 1),
(361, 95, 99, 3, 1),
(362, 95, 95, 3, 1),
(363, 95, 96, 3, 1),
(364, 95, 97, 3, 1),
(365, 96, 98, 3, 1),
(366, 96, 99, 3, 1),
(367, 96, 95, 3, 1),
(368, 96, 96, 3, 1),
(369, 96, 97, 3, 1),
(370, 97, 99, 3, 1),
(371, 97, 98, 3, 1),
(372, 97, 95, 3, 1),
(373, 97, 96, 3, 1),
(374, 97, 97, 3, 1),
(375, 98, 98, 3, 1),
(376, 98, 99, 3, 1),
(377, 98, 95, 3, 1),
(378, 98, 96, 3, 1),
(379, 98, 97, 3, 1),
(380, 99, 98, 3, 1),
(381, 99, 99, 3, 1),
(382, 99, 95, 3, 1),
(383, 99, 96, 3, 1),
(384, 99, 97, 3, 1),
(385, 100, 98, 3, 1),
(386, 100, 99, 3, 1),
(387, 100, 95, 3, 1),
(388, 100, 96, 3, 1),
(389, 100, 97, 3, 1),
(390, 101, 98, 3, 1),
(391, 101, 99, 3, 1),
(392, 101, 95, 3, 1),
(393, 101, 96, 3, 1),
(394, 101, 97, 3, 1),
(395, 102, 98, 3, 1),
(396, 102, 99, 3, 1),
(397, 102, 95, 3, 1),
(398, 102, 96, 3, 1),
(399, 102, 97, 3, 1),
(400, 103, 98, 3, 1),
(401, 103, 99, 3, 1),
(402, 103, 95, 3, 1),
(403, 103, 96, 3, 1),
(404, 103, 97, 3, 1),
(405, 104, 98, 3, 1),
(406, 104, 99, 3, 1),
(407, 104, 95, 3, 1),
(408, 104, 96, 3, 1),
(409, 104, 97, 3, 1),
(410, 105, 98, 3, 1),
(411, 105, 99, 3, 1),
(412, 105, 95, 3, 1),
(413, 105, 96, 3, 1),
(414, 105, 97, 3, 1),
(415, 106, 98, 3, 1),
(416, 106, 99, 3, 1),
(417, 106, 95, 3, 1),
(418, 106, 96, 3, 1),
(419, 106, 97, 3, 1),
(420, 107, 98, 3, 1),
(421, 107, 99, 3, 1),
(422, 107, 95, 3, 1),
(423, 107, 96, 3, 1),
(424, 107, 97, 3, 1),
(425, 108, 98, 3, 1),
(426, 108, 99, 3, 1),
(427, 108, 95, 3, 1),
(428, 108, 96, 3, 1),
(429, 108, 97, 3, 1),
(430, 109, 98, 3, 1),
(431, 109, 99, 3, 1),
(432, 109, 95, 3, 1),
(433, 109, 96, 3, 1),
(434, 109, 97, 3, 1),
(435, 110, 98, 3, 1),
(436, 110, 99, 3, 1),
(437, 110, 95, 3, 1),
(438, 110, 96, 3, 1),
(439, 110, 97, 3, 1),
(440, 111, 98, 3, 1),
(441, 111, 99, 3, 1),
(442, 111, 95, 3, 1),
(443, 111, 96, 3, 1),
(444, 111, 97, 3, 1),
(445, 112, 98, 3, 1),
(446, 112, 99, 3, 1),
(447, 112, 95, 3, 1),
(448, 112, 96, 3, 1),
(449, 112, 97, 3, 1),
(450, 113, 98, 3, 1),
(451, 113, 99, 3, 1),
(452, 113, 95, 3, 1),
(453, 113, 96, 3, 1),
(454, 113, 97, 3, 1),
(455, 114, 98, 3, 1),
(456, 114, 99, 3, 1),
(457, 114, 95, 3, 1),
(458, 114, 96, 3, 1),
(459, 114, 97, 3, 1),
(460, 115, 98, 3, 1),
(461, 115, 99, 3, 1),
(462, 115, 95, 3, 1),
(463, 115, 96, 3, 1),
(464, 115, 97, 3, 1),
(465, 116, 98, 3, 1),
(466, 116, 99, 3, 1),
(467, 116, 95, 3, 1),
(468, 116, 96, 3, 1),
(469, 116, 97, 3, 1),
(470, 117, 98, 3, 1),
(471, 117, 99, 3, 1),
(472, 117, 95, 3, 1),
(473, 117, 96, 3, 1),
(474, 117, 97, 3, 1),
(475, 118, 75, 2, 1),
(476, 118, 78, 2, 1),
(477, 118, 76, 2, 1),
(478, 118, 77, 2, 1),
(479, 119, 75, 2, 1),
(480, 119, 78, 2, 1),
(481, 119, 76, 2, 1),
(482, 119, 77, 2, 1),
(483, 120, 75, 2, 1),
(484, 120, 78, 2, 1),
(485, 120, 76, 2, 1),
(486, 120, 77, 2, 1),
(487, 121, 75, 2, 1),
(488, 121, 78, 2, 1),
(489, 121, 76, 2, 1),
(490, 121, 77, 2, 1),
(491, 122, 75, 2, 1),
(492, 122, 78, 2, 1),
(493, 122, 76, 2, 1),
(494, 123, 75, 2, 1),
(495, 123, 78, 2, 1),
(496, 123, 76, 2, 1),
(497, 123, 77, 2, 1),
(498, 124, 75, 2, 1),
(499, 124, 78, 2, 1),
(500, 124, 76, 2, 1),
(501, 124, 77, 2, 1),
(502, 125, 75, 2, 1),
(503, 125, 78, 2, 1),
(504, 125, 76, 2, 1),
(505, 125, 77, 2, 1),
(506, 126, 93, 2, 1),
(507, 126, 79, 2, 1),
(508, 126, 94, 2, 1),
(509, 126, 82, 2, 1),
(510, 126, 81, 2, 1),
(511, 127, 93, 2, 1),
(512, 127, 79, 2, 1),
(513, 127, 94, 2, 1),
(514, 127, 82, 2, 1),
(515, 127, 81, 2, 1),
(516, 128, 93, 2, 1),
(517, 128, 79, 2, 1),
(518, 128, 94, 2, 1),
(519, 128, 82, 2, 1),
(520, 128, 81, 2, 1),
(521, 129, 93, 2, 1),
(522, 129, 79, 2, 1),
(523, 129, 94, 2, 1),
(524, 129, 82, 2, 1),
(525, 129, 81, 2, 1),
(526, 130, 93, 2, 1),
(527, 130, 79, 2, 1),
(528, 130, 94, 2, 1),
(529, 130, 82, 2, 1),
(530, 130, 81, 2, 1),
(531, 131, 93, 2, 1),
(532, 131, 79, 2, 1),
(533, 131, 94, 2, 1),
(534, 131, 82, 2, 1),
(535, 131, 81, 2, 1),
(536, 132, 93, 2, 1),
(537, 132, 79, 2, 1),
(538, 132, 94, 2, 1),
(539, 132, 82, 2, 1),
(540, 132, 81, 2, 1),
(541, 133, 93, 2, 1),
(542, 133, 79, 2, 1),
(543, 133, 94, 2, 1),
(544, 133, 82, 2, 1),
(545, 133, 81, 2, 1),
(546, 134, 93, 2, 1),
(547, 134, 79, 2, 1),
(548, 134, 94, 2, 1),
(549, 134, 82, 2, 1),
(550, 134, 81, 2, 1),
(551, 135, 93, 2, 1),
(552, 135, 79, 2, 1),
(553, 135, 94, 2, 1),
(554, 135, 82, 2, 1),
(555, 135, 81, 2, 1),
(556, 136, 93, 2, 1),
(557, 136, 79, 2, 1),
(558, 136, 94, 2, 1),
(559, 136, 82, 2, 1),
(560, 136, 81, 2, 1),
(561, 137, 93, 2, 1),
(562, 137, 79, 2, 1),
(563, 137, 94, 2, 1),
(564, 137, 82, 2, 1),
(565, 137, 81, 2, 1),
(566, 138, 93, 2, 1),
(567, 138, 79, 2, 1),
(568, 138, 94, 2, 1),
(569, 138, 82, 2, 1),
(570, 138, 81, 2, 1),
(571, 139, 93, 2, 1),
(572, 139, 79, 2, 1),
(573, 139, 94, 2, 1),
(574, 139, 82, 2, 1),
(575, 139, 81, 2, 1),
(576, 140, 93, 2, 1),
(577, 140, 79, 2, 1),
(578, 140, 94, 2, 1),
(579, 140, 82, 2, 1),
(580, 140, 81, 2, 1),
(581, 141, 93, 2, 1),
(582, 141, 79, 2, 1),
(583, 141, 94, 2, 1),
(584, 141, 82, 2, 1),
(585, 141, 81, 2, 1),
(586, 142, 93, 2, 1),
(587, 142, 79, 2, 1),
(588, 142, 94, 2, 1),
(589, 142, 82, 2, 1),
(590, 142, 81, 2, 1),
(591, 143, 93, 2, 1),
(592, 143, 79, 2, 1),
(593, 143, 94, 2, 1),
(594, 143, 82, 2, 1),
(595, 143, 81, 2, 1),
(596, 144, 93, 2, 1),
(597, 144, 79, 2, 1),
(598, 144, 94, 2, 1),
(599, 144, 82, 2, 1),
(600, 144, 81, 2, 1),
(601, 145, 93, 2, 1),
(602, 145, 79, 2, 1),
(603, 145, 94, 2, 1),
(604, 145, 82, 2, 1),
(605, 145, 81, 2, 1),
(606, 146, 88, 2, 1),
(607, 146, 87, 2, 1),
(608, 146, 86, 2, 1),
(609, 146, 74, 2, 1),
(610, 146, 72, 2, 1),
(611, 147, 88, 2, 1),
(612, 147, 87, 2, 1),
(613, 147, 86, 2, 1),
(614, 147, 74, 2, 1),
(615, 147, 72, 2, 1),
(616, 148, 88, 2, 1),
(617, 148, 87, 2, 1),
(618, 148, 86, 2, 1),
(619, 148, 74, 2, 1),
(620, 148, 72, 2, 1),
(621, 149, 88, 2, 1),
(622, 149, 87, 2, 1),
(623, 149, 86, 2, 1),
(624, 149, 74, 2, 1),
(625, 149, 72, 2, 1),
(626, 150, 88, 2, 1),
(627, 150, 87, 2, 1),
(628, 150, 86, 2, 1),
(629, 150, 74, 2, 1),
(630, 150, 72, 2, 1),
(631, 151, 88, 2, 1),
(632, 151, 87, 2, 1),
(633, 151, 86, 2, 1),
(634, 151, 74, 2, 1),
(635, 151, 72, 2, 1),
(636, 152, 88, 2, 1),
(637, 152, 87, 2, 1),
(638, 152, 86, 2, 1),
(639, 152, 74, 2, 1),
(640, 152, 72, 2, 1),
(641, 153, 88, 2, 1),
(642, 153, 87, 2, 1),
(643, 153, 86, 2, 1),
(644, 153, 74, 2, 1),
(645, 153, 72, 2, 1),
(646, 154, 88, 2, 1),
(647, 154, 87, 2, 1),
(648, 154, 86, 2, 1),
(649, 154, 74, 2, 1),
(650, 154, 72, 2, 1),
(651, 155, 88, 2, 1),
(652, 155, 87, 2, 1),
(653, 155, 86, 2, 1),
(654, 155, 74, 2, 1),
(655, 155, 72, 2, 1),
(656, 156, 88, 2, 1),
(657, 156, 87, 2, 1),
(658, 156, 86, 2, 1),
(659, 156, 74, 2, 1),
(660, 156, 72, 2, 1),
(661, 157, 88, 2, 1),
(662, 157, 87, 2, 1),
(663, 157, 86, 2, 1),
(664, 157, 74, 2, 1),
(665, 157, 72, 2, 1),
(666, 158, 88, 2, 1),
(667, 158, 87, 2, 1),
(668, 158, 86, 2, 1),
(669, 158, 74, 2, 1),
(670, 158, 72, 2, 1),
(671, 159, 88, 1, 1),
(672, 159, 87, 1, 1),
(673, 159, 86, 1, 1),
(674, 159, 74, 1, 1),
(675, 159, 72, 1, 1),
(676, 160, 88, 2, 1),
(677, 160, 87, 2, 1),
(678, 160, 86, 2, 1),
(679, 160, 74, 2, 1),
(680, 160, 72, 2, 1),
(681, 161, 88, 2, 1),
(682, 161, 87, 2, 1),
(683, 161, 86, 2, 1),
(684, 161, 74, 2, 1),
(685, 161, 72, 2, 1),
(686, 162, 88, 2, 1),
(687, 162, 87, 2, 1),
(688, 162, 86, 2, 1),
(689, 162, 74, 2, 1),
(690, 162, 72, 2, 1),
(691, 163, 88, 2, 1),
(692, 163, 87, 2, 1),
(693, 163, 86, 2, 1),
(694, 163, 74, 2, 1),
(695, 163, 72, 2, 1),
(696, 164, 88, 2, 1),
(697, 164, 87, 2, 1),
(698, 164, 86, 2, 1),
(699, 164, 74, 2, 1),
(700, 164, 72, 2, 1),
(701, 165, 88, 2, 1),
(702, 165, 87, 2, 1),
(703, 165, 86, 2, 1),
(704, 165, 74, 2, 1),
(705, 165, 72, 2, 1),
(706, 166, 65, 2, 1),
(707, 166, 67, 2, 1),
(708, 166, 66, 2, 1),
(709, 166, 69, 2, 1),
(710, 166, 68, 2, 1),
(711, 167, 65, 2, 1),
(712, 167, 67, 2, 1),
(713, 167, 66, 2, 1),
(714, 167, 69, 2, 1),
(715, 167, 68, 2, 1),
(716, 168, 65, 2, 1),
(717, 168, 67, 2, 1),
(718, 168, 66, 2, 1),
(719, 168, 69, 2, 1),
(720, 168, 68, 2, 1),
(721, 169, 65, 2, 1),
(722, 169, 67, 2, 1),
(723, 169, 66, 2, 1),
(724, 169, 69, 2, 1),
(725, 169, 68, 2, 1),
(726, 170, 65, 2, 1),
(727, 170, 67, 2, 1),
(728, 170, 66, 2, 1),
(729, 170, 69, 2, 1),
(730, 170, 68, 2, 1),
(731, 171, 65, 2, 1),
(732, 171, 67, 2, 1),
(733, 171, 66, 2, 1),
(734, 171, 69, 2, 1),
(735, 171, 68, 2, 1),
(736, 172, 65, 2, 1),
(737, 172, 67, 2, 1),
(738, 172, 66, 2, 1),
(739, 172, 69, 2, 1),
(740, 172, 68, 2, 1),
(741, 173, 65, 2, 1),
(742, 173, 67, 2, 1),
(743, 173, 66, 2, 1),
(744, 173, 69, 2, 1),
(745, 173, 68, 2, 1),
(746, 174, 65, 2, 1),
(747, 174, 67, 2, 1),
(748, 174, 66, 2, 1),
(749, 174, 69, 2, 1),
(750, 174, 68, 2, 1),
(751, 175, 65, 2, 1),
(752, 175, 67, 2, 1),
(753, 175, 66, 2, 1),
(754, 175, 69, 2, 1),
(755, 175, 68, 2, 1),
(756, 176, 65, 2, 1),
(757, 176, 67, 2, 1),
(758, 176, 66, 2, 1),
(759, 176, 69, 2, 1),
(760, 176, 68, 2, 1),
(761, 177, 65, 2, 1),
(762, 177, 67, 2, 1),
(763, 177, 66, 2, 1),
(764, 177, 69, 2, 1),
(765, 177, 68, 2, 1),
(766, 178, 65, 2, 1),
(767, 178, 67, 2, 1),
(768, 178, 66, 2, 1),
(769, 178, 69, 2, 1),
(770, 178, 68, 2, 1),
(771, 179, 65, 2, 1),
(772, 179, 67, 2, 1),
(773, 179, 66, 2, 1),
(774, 179, 69, 2, 1),
(775, 179, 68, 2, 1),
(776, 180, 65, 2, 1),
(777, 180, 67, 2, 1),
(778, 180, 66, 2, 1),
(779, 180, 69, 2, 1),
(780, 180, 68, 2, 1),
(781, 181, 65, 2, 1),
(782, 181, 67, 2, 1),
(783, 181, 66, 2, 1),
(784, 181, 69, 2, 1),
(785, 181, 68, 2, 1),
(786, 182, 65, 2, 1),
(787, 182, 67, 2, 1),
(788, 182, 66, 2, 1),
(789, 182, 69, 2, 1),
(790, 182, 68, 2, 1),
(791, 183, 65, 2, 1),
(792, 183, 67, 2, 1),
(793, 183, 66, 2, 1),
(794, 183, 69, 2, 1),
(795, 183, 68, 2, 1),
(796, 184, 65, 2, 1),
(797, 184, 67, 2, 1),
(798, 184, 66, 2, 1),
(799, 184, 69, 2, 1),
(800, 184, 68, 2, 1),
(801, 185, 65, 2, 1),
(802, 185, 67, 2, 1),
(803, 185, 66, 2, 1),
(804, 185, 69, 2, 1),
(805, 185, 68, 2, 1),
(807, 187, 113, 2, 1),
(808, 188, 114, 2, 1),
(809, 189, 115, 2, 1),
(810, 190, 116, 2, 1),
(811, 191, 117, 2, 1),
(812, 192, 118, 2, 1),
(813, 193, 119, 2, 1),
(815, 195, 121, 2, 1),
(816, 196, 122, 2, 1),
(817, 197, 123, 2, 1),
(818, 198, 124, 2, 1),
(819, 199, 125, 2, 1),
(820, 200, 126, 2, 1),
(821, 201, 127, 2, 1),
(822, 202, 128, 2, 1),
(823, 203, 129, 2, 1),
(824, 204, 130, 2, 1),
(825, 205, 131, 2, 1),
(826, 206, 132, 2, 1),
(827, 207, 133, 2, 1),
(828, 208, 134, 2, 1),
(829, 209, 135, 2, 1),
(830, 210, 136, 2, 1),
(831, 211, 137, 2, 1),
(832, 212, 138, 2, 1),
(833, 213, 139, 2, 1),
(834, 214, 140, 2, 1),
(835, 215, 141, 2, 1),
(836, 216, 127, 2, 1),
(837, 217, 128, 2, 1),
(838, 218, 129, 2, 1),
(839, 219, 130, 2, 1),
(840, 220, 131, 2, 1),
(841, 221, 132, 2, 1),
(842, 222, 133, 2, 1),
(843, 223, 134, 2, 1),
(844, 224, 135, 2, 1),
(845, 225, 136, 2, 1),
(846, 186, 129, 2, 1),
(847, 186, 130, 2, 1),
(848, 186, 131, 2, 1),
(849, 186, 132, 2, 1),
(850, 186, 133, 2, 1),
(851, 187, 134, 2, 1),
(852, 187, 135, 2, 1),
(853, 187, 136, 2, 1),
(854, 187, 137, 2, 1),
(855, 188, 138, 2, 1),
(856, 188, 139, 2, 1),
(857, 188, 140, 2, 1),
(858, 188, 141, 2, 1),
(859, 188, 142, 2, 1),
(860, 189, 143, 2, 1),
(861, 189, 144, 2, 1),
(862, 189, 145, 2, 1),
(863, 189, 146, 2, 1),
(864, 190, 147, 2, 1),
(865, 190, 148, 2, 1),
(866, 190, 149, 2, 1),
(867, 190, 150, 2, 1),
(868, 190, 151, 2, 1),
(869, 191, 129, 2, 1),
(870, 191, 130, 2, 1),
(871, 191, 131, 2, 1),
(872, 191, 132, 2, 1),
(873, 192, 133, 2, 1),
(874, 192, 134, 2, 1),
(875, 192, 135, 2, 1),
(876, 192, 136, 2, 1),
(877, 192, 137, 2, 1),
(878, 193, 138, 2, 1),
(879, 193, 139, 2, 1),
(880, 193, 140, 2, 1),
(881, 193, 141, 2, 1),
(882, 194, 142, 2, 1),
(883, 194, 143, 2, 1),
(884, 194, 144, 2, 1),
(885, 194, 145, 2, 1),
(886, 194, 146, 2, 1),
(887, 195, 147, 2, 1),
(888, 195, 148, 2, 1),
(889, 195, 149, 2, 1),
(890, 195, 150, 2, 1),
(891, 196, 151, 2, 1),
(892, 196, 129, 2, 1),
(893, 196, 130, 2, 1),
(894, 196, 131, 2, 1),
(895, 196, 132, 2, 1),
(896, 197, 133, 2, 1),
(897, 197, 134, 2, 1),
(898, 197, 135, 2, 1),
(899, 197, 136, 2, 1),
(900, 198, 137, 2, 1),
(901, 198, 138, 2, 1),
(902, 198, 139, 2, 1),
(903, 198, 140, 2, 1),
(904, 198, 141, 2, 1),
(905, 199, 142, 2, 1),
(906, 199, 143, 2, 1),
(907, 199, 144, 2, 1),
(908, 199, 145, 2, 1),
(909, 200, 146, 2, 1),
(910, 200, 147, 2, 1),
(911, 200, 148, 2, 1),
(912, 200, 149, 2, 1),
(913, 200, 150, 2, 1),
(914, 201, 151, 2, 1),
(915, 201, 129, 2, 1),
(916, 201, 130, 2, 1),
(917, 201, 131, 2, 1),
(918, 202, 132, 2, 1),
(919, 202, 133, 2, 1),
(920, 202, 134, 2, 1),
(921, 202, 135, 2, 1),
(922, 202, 136, 2, 1),
(923, 203, 137, 2, 1),
(924, 203, 138, 2, 1),
(925, 203, 139, 2, 1),
(926, 203, 140, 2, 1),
(927, 204, 141, 2, 1),
(928, 204, 142, 2, 1),
(929, 204, 143, 2, 1),
(930, 204, 144, 2, 1),
(931, 204, 145, 2, 1),
(932, 205, 146, 2, 1),
(933, 205, 147, 2, 1),
(934, 205, 148, 2, 1),
(935, 205, 149, 2, 1),
(936, 206, 150, 2, 1),
(937, 206, 151, 2, 1),
(938, 206, 129, 2, 1),
(939, 206, 130, 2, 1),
(940, 206, 131, 2, 1),
(941, 207, 132, 2, 1),
(942, 207, 133, 2, 1),
(943, 207, 134, 2, 1),
(944, 207, 135, 2, 1),
(945, 208, 136, 2, 1),
(946, 208, 137, 2, 1),
(947, 208, 138, 2, 1),
(948, 208, 139, 2, 1),
(949, 208, 140, 2, 1),
(950, 209, 141, 2, 1),
(951, 209, 142, 2, 1),
(952, 209, 143, 2, 1),
(953, 209, 144, 2, 1),
(954, 210, 145, 2, 1),
(955, 210, 146, 2, 1),
(956, 210, 147, 2, 1),
(957, 210, 148, 2, 1),
(958, 210, 149, 2, 1),
(959, 211, 150, 2, 1),
(960, 211, 151, 2, 1),
(961, 211, 129, 2, 1),
(962, 211, 130, 2, 1),
(963, 212, 131, 2, 1),
(964, 212, 132, 2, 1),
(965, 212, 133, 2, 1),
(966, 212, 134, 2, 1),
(967, 212, 135, 2, 1),
(968, 213, 136, 2, 1),
(969, 213, 137, 2, 1),
(970, 213, 138, 2, 1),
(971, 213, 139, 2, 1),
(972, 214, 140, 2, 1),
(973, 214, 141, 2, 1),
(974, 214, 142, 2, 1),
(975, 214, 143, 2, 1),
(976, 214, 144, 2, 1),
(977, 215, 145, 2, 1),
(978, 215, 146, 2, 1),
(979, 215, 147, 2, 1),
(980, 215, 148, 2, 1),
(981, 216, 149, 2, 1),
(982, 216, 150, 2, 1),
(983, 216, 151, 2, 1),
(984, 216, 129, 2, 1),
(985, 216, 130, 2, 1),
(986, 217, 131, 2, 1),
(987, 217, 132, 2, 1),
(988, 217, 133, 2, 1),
(989, 217, 134, 2, 1),
(990, 218, 135, 2, 1),
(991, 218, 136, 2, 1),
(992, 218, 137, 2, 1),
(993, 218, 138, 2, 1),
(994, 218, 139, 2, 1),
(995, 219, 140, 2, 1),
(996, 219, 141, 2, 1),
(997, 219, 142, 2, 1),
(998, 219, 143, 2, 1),
(999, 220, 144, 2, 1),
(1000, 220, 145, 2, 1),
(1001, 220, 146, 2, 1),
(1002, 220, 147, 2, 1),
(1003, 220, 148, 2, 1),
(1004, 221, 149, 2, 1),
(1005, 221, 150, 2, 1),
(1006, 221, 151, 2, 1),
(1007, 221, 129, 2, 1),
(1008, 222, 130, 2, 1),
(1009, 222, 131, 2, 1),
(1010, 222, 132, 2, 1),
(1011, 222, 133, 2, 1),
(1012, 222, 134, 2, 1),
(1013, 223, 135, 2, 1),
(1014, 223, 136, 2, 1),
(1015, 223, 137, 2, 1),
(1016, 223, 138, 2, 1),
(1017, 224, 139, 2, 1),
(1018, 224, 140, 2, 1),
(1019, 224, 141, 2, 1),
(1020, 224, 142, 2, 1),
(1021, 224, 143, 2, 1),
(1022, 225, 144, 2, 1),
(1023, 225, 145, 2, 1),
(1024, 225, 146, 2, 1),
(1025, 225, 147, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `year_level`
--

CREATE TABLE `year_level` (
  `year_id` int NOT NULL,
  `year_level_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `year_level`
--

INSERT INTO `year_level` (`year_id`, `year_level_name`) VALUES
(1, '1st Year'),
(2, '2nd Year'),
(3, '3rd Year'),
(4, '4th Year');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `fk_attendance_student_details` (`student_details_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `drop_history`
--
ALTER TABLE `drop_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `idx_original_drop_request_id` (`drop_request_id`);

--
-- Indexes for table `drop_request`
--
ALTER TABLE `drop_request`
  ADD PRIMARY KEY (`drop_request_id`),
  ADD KEY `student_details_id` (`student_details_id`);

--
-- Indexes for table `excused_request`
--
ALTER TABLE `excused_request`
  ADD PRIMARY KEY (`excused_request_id`),
  ADD KEY `student_details_id` (`student_details_id`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`instructor_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `program_details`
--
ALTER TABLE `program_details`
  ADD PRIMARY KEY (`program_details_id`),
  ADD KEY `program_id` (`program_id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`section_id`),
  ADD KEY `fk_section_year_level` (`year_level_id`),
  ADD KEY `fk_section_semester` (`semester_id`);

--
-- Indexes for table `section_courses`
--
ALTER TABLE `section_courses`
  ADD PRIMARY KEY (`section_course_id`),
  ADD UNIQUE KEY `idx_unique_section_course` (`section_id`,`course_id`),
  ADD KEY `fk_section_courses_course` (`course_id`),
  ADD KEY `fk_section_courses_instructor` (`instructor_id`);

--
-- Indexes for table `semester`
--
ALTER TABLE `semester`
  ADD PRIMARY KEY (`semester_id`),
  ADD UNIQUE KEY `semester_name` (`semester_name`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `student_details`
--
ALTER TABLE `student_details`
  ADD PRIMARY KEY (`student_details_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `program_details_id` (`program_details_id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `fk_student_details_section_courses` (`section_course_id`);

--
-- Indexes for table `year_level`
--
ALTER TABLE `year_level`
  ADD PRIMARY KEY (`year_id`),
  ADD UNIQUE KEY `year_level_name` (`year_level_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `attendance_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=327;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `course_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `department_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `drop_history`
--
ALTER TABLE `drop_history`
  MODIFY `history_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `drop_request`
--
ALTER TABLE `drop_request`
  MODIFY `drop_request_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `excused_request`
--
ALTER TABLE `excused_request`
  MODIFY `excused_request_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `instructor`
--
ALTER TABLE `instructor`
  MODIFY `instructor_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `program_details`
--
ALTER TABLE `program_details`
  MODIFY `program_details_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `section_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `section_courses`
--
ALTER TABLE `section_courses`
  MODIFY `section_course_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

--
-- AUTO_INCREMENT for table `semester`
--
ALTER TABLE `semester`
  MODIFY `semester_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=228;

--
-- AUTO_INCREMENT for table `student_details`
--
ALTER TABLE `student_details`
  MODIFY `student_details_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1028;

--
-- AUTO_INCREMENT for table `year_level`
--
ALTER TABLE `year_level`
  MODIFY `year_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_attendance_student_details` FOREIGN KEY (`student_details_id`) REFERENCES `student_details` (`student_details_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `drop_request`
--
ALTER TABLE `drop_request`
  ADD CONSTRAINT `drop_request_ibfk_1` FOREIGN KEY (`student_details_id`) REFERENCES `student_details` (`student_details_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `excused_request`
--
ALTER TABLE `excused_request`
  ADD CONSTRAINT `excused_request_ibfk_1` FOREIGN KEY (`student_details_id`) REFERENCES `student_details` (`student_details_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `program_details`
--
ALTER TABLE `program_details`
  ADD CONSTRAINT `program_details_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `program_details_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `fk_section_semester` FOREIGN KEY (`semester_id`) REFERENCES `semester` (`semester_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_section_year_level` FOREIGN KEY (`year_level_id`) REFERENCES `year_level` (`year_id`) ON UPDATE CASCADE;

--
-- Constraints for table `section_courses`
--
ALTER TABLE `section_courses`
  ADD CONSTRAINT `fk_section_courses_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_section_courses_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`instructor_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_section_courses_section` FOREIGN KEY (`section_id`) REFERENCES `section` (`section_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_details`
--
ALTER TABLE `student_details`
  ADD CONSTRAINT `fk_student_details_section_courses` FOREIGN KEY (`section_course_id`) REFERENCES `section_courses` (`section_course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_details_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_details_ibfk_4` FOREIGN KEY (`program_details_id`) REFERENCES `program_details` (`program_details_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_details_ibfk_5` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
