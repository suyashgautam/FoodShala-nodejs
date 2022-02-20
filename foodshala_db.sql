-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 20, 2022 at 09:15 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodshala_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart_tb`
--

CREATE TABLE `cart_tb` (
  `r_id` bigint(10) NOT NULL,
  `d_id` bigint(10) NOT NULL,
  `c_email` varchar(50) COLLATE utf8_bin NOT NULL,
  `d_cost` int(20) NOT NULL,
  `cart_quantity` int(11) NOT NULL DEFAULT 1,
  `d_name` varchar(50) COLLATE utf8_bin NOT NULL,
  `cart_datetime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `customerlogin_tb`
--

CREATE TABLE `customerlogin_tb` (
  `c_id` int(11) NOT NULL,
  `c_name` varchar(60) COLLATE utf8_bin NOT NULL,
  `c_phone` int(10) NOT NULL,
  `c_preference` varchar(10) COLLATE utf8_bin NOT NULL,
  `c_address` varchar(100) COLLATE utf8_bin NOT NULL,
  `c_email` varchar(50) COLLATE utf8_bin NOT NULL,
  `c_password` varchar(100) COLLATE utf8_bin NOT NULL,
  `c_image` varchar(100) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `customerlogin_tb`
--

INSERT INTO `customerlogin_tb` (`c_id`, `c_name`, `c_phone`, `c_preference`, `c_address`, `c_email`, `c_password`, `c_image`) VALUES
(8, 'Suyash', 2147483647, 'Veg', 'Lucknow', 'suyash.gautam97@gmail.com', '1234', 'Customer/image/alan-rojo-pinedo-rLnD5DuB3NI-unsplash.jpg'),
(9, 'Customer2', 2147483647, 'Veg', 'Delhi', 'customer2@gmail.com', '1234', 'Customer/image/raphael-lovaski-2sEgCoO9dkY-unsplash.jpg'),
(10, 'Customer3', 2147483647, 'Veg', 'Lucknow', 'customer3@gmail.com', '1234', 'Customer/image/michael-dam-mEZ3PoFGs_k-unsplash.jpg'),
(11, 'Customer4', 2147483647, 'Veg', 'Delhi', 'customer4@gmail.com', '1234', 'Customer/image/yasin-pixel-zrJO_KVWZZw-unsplash.jpg'),
(16, 'Swara', 2147483647, 'Veg', 'Indira', 'Chuttan@gmail.com', '$2b$10$5icovKRUkr6mdnMTmUA58e4s4PyUsX377slQeaE2PRceRCW95ibJ.', 'Customer/image/2022-02-17T16-50-35.291Z'),
(37, 'Ashok', 2147483647, 'Veg', '3/335 Vishal khand', 'suyash.gautam97@gmail.com', '$2b$10$4lEcTQO6AH57XewuqvAFj.GzBXK.0Fi5rPTRGVDlb/ZiDKAHBvWDu', 'Customer/image/2022-02-07T17-26-53.999ZCapture.');

-- --------------------------------------------------------

--
-- Table structure for table `dishes_tb`
--

CREATE TABLE `dishes_tb` (
  `d_id` int(11) NOT NULL,
  `rest_id` int(11) NOT NULL,
  `d_name` varchar(100) COLLATE utf8_bin NOT NULL,
  `d_cost` bigint(15) NOT NULL,
  `d_type` text COLLATE utf8_bin NOT NULL,
  `d_image` varchar(200) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `dishes_tb`
--

INSERT INTO `dishes_tb` (`d_id`, `rest_id`, `d_name`, `d_cost`, `d_type`, `d_image`) VALUES
(11, 8, 'Corn Pizza', 240, 'Veg', 'Restaurants/image/pexels-cats-coming-367915.jpg'),
(12, 8, 'Veggie Pizza', 300, 'Veg', 'Restaurants/image/pexels-daria-shevtsova-1260968.jpg'),
(13, 8, 'Pepperoni Pizza', 400, 'Non Veg', 'Restaurants/image/pexels-polina-tankilevitch-4109111.jpg'),
(14, 9, 'Chole Bhature', 100, 'Veg', 'Restaurants/image/_650x_2019121214325859.jpg'),
(16, 9, 'Pav Bhaji', 150, 'Veg', 'Restaurants/image/pav.png'),
(17, 10, 'Idli Sambhar', 90, 'Veg', 'Restaurants/image/idli.jpg'),
(18, 10, 'Masala Dosa', 150, 'Veg', 'Restaurants/image/Masala-Dosa-500x500.jpg'),
(19, 10, 'Uttapam', 120, 'Veg', 'Restaurants/image/uttapam.jpg'),
(20, 11, 'Kadhai Paneer', 250, 'Veg', 'Restaurants/image/kadai-paneer-1-500x500.jpg'),
(21, 11, 'Naan', 60, 'Veg', 'Restaurants/image/naan-recipe-2.jpg'),
(22, 11, 'Palak Paneer', 230, 'Veg', 'Restaurants/image/Palak-Paneer-4x5-LOWRES.jpg'),
(23, 12, 'Mix Veg', 200, 'Veg', 'Restaurants/image/mix veg.jpg'),
(24, 12, 'Tandoori Roti', 25, 'Veg', 'Restaurants/image/Tandoori-roti-5.jpg'),
(25, 12, 'Tawa Roti', 15, 'Veg', 'Restaurants/image/tawa.jpg'),
(26, 13, 'Butter Chicken', 350, 'Non Veg', 'Restaurants/image/butter chicken.jpg'),
(27, 13, 'Mutton Rogan Josh', 400, 'Non Veg', 'Restaurants/image/Mutton-Rogan-Josh.jpg'),
(28, 13, 'Tandoori Chicken', 370, 'Non Veg', 'Restaurants/image/Tandoori-Chicken-1-3.jpg'),
(29, 14, 'Chicken Curry', 350, 'Non Veg', 'Restaurants/image/chicken-curry-recipe.jpg'),
(30, 14, 'Mutton Curry', 370, 'Non Veg', 'Restaurants/image/Kolhapuri-mutton-curry.jpg'),
(31, 14, 'Paneer Lababdar', 250, 'Veg', 'Restaurants/image/Paneer-Lababdar-3.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `order_tb`
--

CREATE TABLE `order_tb` (
  `od_id` int(11) NOT NULL,
  `o_id` varchar(100) COLLATE utf8_bin NOT NULL,
  `d_id` int(11) NOT NULL,
  `d_name` varchar(100) COLLATE utf8_bin NOT NULL,
  `d_quantity` int(11) NOT NULL,
  `r_id` int(11) NOT NULL,
  `o_status` varchar(20) COLLATE utf8_bin NOT NULL,
  `o_payment` int(11) NOT NULL,
  `c_email` varchar(50) COLLATE utf8_bin NOT NULL,
  `o_datetime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `order_tb`
--

INSERT INTO `order_tb` (`od_id`, `o_id`, `d_id`, `d_name`, `d_quantity`, `r_id`, `o_status`, `o_payment`, `c_email`, `o_datetime`) VALUES
(11, '38', 11, 'Corn Pizza', 1, 8, '', 0, 'suyash.gautam97@gmail.com', '2022-02-17 22:52:27'),
(12, '38', 14, 'Chole Bhature', 1, 9, '', 0, 'suyash.gautam97@gmail.com', '2022-02-17 22:52:27'),
(13, '40', 14, 'Chole Bhature', 1, 9, '', 0, 'suyash.gautam97@gmail.com', '2022-02-17 22:52:27'),
(14, '40', 21, 'Naan', 1, 11, '', 0, 'suyash.gautam97@gmail.com', '2022-02-17 22:52:27'),
(15, '43', 13, 'Butter Chicken', 6, 8, '', 0, 'suyash.gautam97@gmail.com', '2022-02-17 22:52:27'),
(22, '3e3f2f60-918c-11ec-8627-7325ae699e0a', 12, 'Veggie Pizza', 5, 8, 'In Progress', 1500, 'Chuttan@gmail.com', '2022-02-19 19:30:06'),
(23, '3e3f2f60-918c-11ec-8627-7325ae699e0a', 13, '	 Pepperoni Pizza', 1, 8, 'In Progress', 400, 'Chuttan@gmail.com', '2022-02-19 19:30:06'),
(24, '03d10c40-9191-11ec-a9b8-259202c74134', 12, 'Veggie Pizza', 1, 8, 'In Progress', 300, 'Chuttan@gmail.com', '2022-02-19 20:04:16'),
(25, '03d10c40-9191-11ec-a9b8-259202c74134', 16, 'Pav Bhaji', 1, 9, 'In Progress', 150, 'Chuttan@gmail.com', '2022-02-19 20:04:16');

-- --------------------------------------------------------

--
-- Table structure for table `restaurantlogin_tb`
--

CREATE TABLE `restaurantlogin_tb` (
  `rest_id` int(11) NOT NULL,
  `r_name` varchar(50) COLLATE utf8_bin NOT NULL,
  `r_address` varchar(100) COLLATE utf8_bin NOT NULL,
  `r_email` varchar(50) COLLATE utf8_bin NOT NULL,
  `r_password` varchar(100) COLLATE utf8_bin NOT NULL,
  `r_image` varchar(100) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `restaurantlogin_tb`
--

INSERT INTO `restaurantlogin_tb` (`rest_id`, `r_name`, `r_address`, `r_email`, `r_password`, `r_image`) VALUES
(8, 'Dominos', 'Delhi', 'vendor1@gmail.com', '$2b$10$Q4Se2J3F3YN2v3bjg4PGTuZjzkQjj/B98shESl8pH/0wC7UzC8p4e', 'Restaurants/image/aleks-marinkovic--dlVOoZSYf0-unsplash.jpg'),
(9, 'Haldiram', 'Delhi', 'rest2@gmail.com', '$2b$10$Q4Se2J3F3YN2v3bjg4PGTuZjzkQjj/B98shESl8pH/0wC7UzC8p4e', 'Restaurants/image/pexels-anna-tis-6341164.jpg'),
(10, 'Sagar Ratna', 'Lucknow', 'rest3@gmail.com', '1234', 'Restaurants/image/pexels-olya-kobruseva-4676640.jpg'),
(11, 'Moti Mahal', 'Lucknow', 'rest4@gmail.com', '1234', 'Restaurants/image/pexels-rene-asmussen-1581384.jpg'),
(12, 'Bikanervala', 'Delhi', 'rest5@gmail.com', '1234', 'Restaurants/image/pexels-volkan-vardar-3887985.jpg'),
(13, 'Namaste Punjab', 'Delhi', 'rest6@gmail.com', '1234', 'Restaurants/image/proriat-hospitality-7fuDHi1CG8s-unsplash.jpg'),
(14, 'Nazeer Foods', 'Lucknow', 'rest7@gmail.com', '1234', 'Restaurants/image/rod-long-WC7LeX79iEU-unsplash.jpg'),
(25, 'LKO', 'LKO', 'rest50@gmail.com', '$2b$10$2CJJ32Ycxa7Xqrk3u7FvKuUwc9pKSR6z0mGUVZkn5h2J1wYvsYDhG', 'Restaurants/image/2022-02-12T07-28-17.242Z21'),
(26, 'Green Restaurant', 'Lucknow', 'rest51@gmail.com', '$2b$10$4.D0XJrjDTgbERYNA3DSmeSUKObSCmH507l7Ljdk16na2.A7Dqx1m', 'Restaurants/image/2022-02-12T07-32-30.088Z21'),
(27, 'rest101', 'Bangalore', 'rest101@gmail.com', '$2b$10$Q4Se2J3F3YN2v3bjg4PGTuZjzkQjj/B98shESl8pH/0wC7UzC8p4e', 'Restaurants/image/2022-02-17T17-01-01.625Z');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart_tb`
--
ALTER TABLE `cart_tb`
  ADD PRIMARY KEY (`r_id`,`d_id`,`c_email`);

--
-- Indexes for table `customerlogin_tb`
--
ALTER TABLE `customerlogin_tb`
  ADD PRIMARY KEY (`c_id`);

--
-- Indexes for table `dishes_tb`
--
ALTER TABLE `dishes_tb`
  ADD PRIMARY KEY (`d_id`),
  ADD KEY `rest_id` (`rest_id`);

--
-- Indexes for table `order_tb`
--
ALTER TABLE `order_tb`
  ADD PRIMARY KEY (`od_id`);

--
-- Indexes for table `restaurantlogin_tb`
--
ALTER TABLE `restaurantlogin_tb`
  ADD PRIMARY KEY (`rest_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customerlogin_tb`
--
ALTER TABLE `customerlogin_tb`
  MODIFY `c_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `dishes_tb`
--
ALTER TABLE `dishes_tb`
  MODIFY `d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `order_tb`
--
ALTER TABLE `order_tb`
  MODIFY `od_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `restaurantlogin_tb`
--
ALTER TABLE `restaurantlogin_tb`
  MODIFY `rest_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dishes_tb`
--
ALTER TABLE `dishes_tb`
  ADD CONSTRAINT `rest_id` FOREIGN KEY (`rest_id`) REFERENCES `restaurantlogin_tb` (`rest_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
