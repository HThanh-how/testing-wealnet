"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Skeleton,
  Flex,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  NotAllowedIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SunIcon,
  MoonIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";

interface Kols {
  KolID: number;
  UserProfileID: number;
  Language: string;
  Education: string;
  ExpectedSalary: number;
  ExpectedSalaryEnable: boolean;
  ChannelSettingTypeID: number;
  IDFrontURL: string;
  IDBackURL: string;
  PortraitURL: string;
  RewardID: number;
  PaymentMethodID: number;
  TestimonialsID: number;
  VerificationStatus: string;
  Enabled: boolean;
  ActiveDate: Date;
  Active: boolean;
  CreatedBy: string;
  CreatedDate: Date;
  ModifiedBy: string;
  ModifiedDate: Date;
  IsRemove: boolean;
  IsOnBoarding: boolean;
  Code: string;
  PortraitRightURL: string;
  PortraitLeftURL: string;
  LivenessStatus: string;
}

const Page = () => {
  const [kols, setKols] = useState<Kols[]>([]);
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState<{ column: string; order: "asc" | "desc" }>({
    column: "KolID",
    order: "asc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total pages from backend
  const [loading, setLoading] = useState(true);
  const [selectedKolIndex, setSelectedKolIndex] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const tableRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchKols(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]); // Fetch data again when page or rows per page changes

  const fetchKols = async (pageIndex: number, pageSize: number) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/kols?pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
      setKols(response.data.kol); // KOL data from backend
      setTotalPages(Math.ceil(response.data.totalCount / pageSize)); // Calculate total pages
    } catch (error) {
      console.error("Error fetching KOLs:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const sortData = (column: string) => {
    const order = sortBy.column === column && sortBy.order === "asc" ? "desc" : "asc";
    setSortBy({ column, order });
  };

  const scrollTable = (direction: "up" | "down") => {
    if (tableRef.current) {
      const scrollAmount = direction === "up" ? -30 : 30;
      tableRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });

      const scrollPosition = tableRef.current.scrollTop;
      const maxScrollPosition = tableRef.current.scrollHeight - tableRef.current.clientHeight;

      if (direction === "down" && scrollPosition >= maxScrollPosition - 5) {
        if (currentPage < totalPages) {
          setCurrentPage((prev) => prev + 1);
          tableRef.current.scrollTo({ top: 0, behavior: "smooth" }); 
        }
      }

      if (direction === "up" && scrollPosition <= 5) {
        if (currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
          tableRef.current.scrollTo({ top: tableRef.current.scrollHeight, behavior: "smooth" }); 
        }
      }
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openModal = (index: number) => {
    setSelectedKolIndex(index);
    onOpen();
  };

  const filteredKols = kols.filter((kol) => {
    const searchText = filterText.toLowerCase();
    return (
      kol.KolID.toString().toLowerCase().includes(searchText) ||
      kol.Education.toLowerCase().includes(searchText) ||
      kol.Language.toLowerCase().includes(searchText) ||
      (kol.ExpectedSalaryEnable &&
        kol.ExpectedSalary.toString().includes(searchText)) ||
      kol.VerificationStatus.toLowerCase().includes(searchText) ||
      kol.LivenessStatus.toLowerCase().includes(searchText)
    );
  });

  const sortedKols = filteredKols.sort((a, b) => {
    const isAsc = sortBy.order === "asc";
    if (sortBy.column === "KolID") {
      return isAsc ? a.KolID - b.KolID : b.KolID - a.KolID;
    } else if (sortBy.column === "Education") {
      return isAsc
        ? a.Education.localeCompare(b.Education)
        : b.Education.localeCompare(a.Education);
    } else if (sortBy.column === "Language") {
      return isAsc
        ? a.Language.localeCompare(b.Language)
        : b.Language.localeCompare(a.Language);
    } else if (sortBy.column === "ExpectedSalary") {
      return isAsc
        ? a.ExpectedSalary - b.ExpectedSalary
        : b.ExpectedSalary - a.ExpectedSalary;
    } else if (sortBy.column === "VerificationStatus") {
      return isAsc
        ? a.VerificationStatus.localeCompare(b.VerificationStatus)
        : b.VerificationStatus.localeCompare(a.VerificationStatus);
    } else if (sortBy.column === "LivenessStatus") {
      return isAsc
        ? a.LivenessStatus.localeCompare(b.LivenessStatus)
        : b.LivenessStatus.localeCompare(a.LivenessStatus);
    }
    return 0;
  });

  return (
    <Box p={5} bg={bgColor} minHeight="100vh">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
        <Heading as="h1">KoL List</Heading>
        <IconButton
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          aria-label="Toggle dark mode"
          onClick={toggleColorMode}
        />
      </Box>

      <Box mb={5} display="flex" justifyContent="space-between" alignItems="center">
        <Input
          placeholder="Tìm kiếm"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          width="auto"
        />
        <Flex>
          <IconButton
            ml={4}
            icon={<ChevronUpIcon />}
            aria-label="Scroll up"
            onClick={() => scrollTable("up")}
          />
          <IconButton
            ml={4}
            icon={<ChevronDownIcon />}
            aria-label="Scroll down"
            onClick={() => scrollTable("down")}
          />
          <Select
            ml={4}
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            width="auto"
          >
            <option value={5}>5 dòng</option>
            <option value={10}>10 dòng</option>
            <option value={15}>15 dòng</option>
            <option value={20}>20 dòng</option>
          </Select>
        </Flex>
      </Box>

      {loading ? (
        <Box>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Education</Th>
                <Th>Language</Th>
                <Th>Expected Salary</Th>
                <Th>Verified</Th>
                <Th>Liveness Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.from({ length: rowsPerPage }).map((_, index) => (
                <Tr key={index}>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Box position="relative">
          <Box
            overflow="auto"
            maxHeight="70vh"
            ref={tableRef}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Table variant="simple" position="relative">
              <Thead position="sticky" top={0} zIndex={10} bg={bgColor}>
                <Tr>
                  <Th onClick={() => sortData("KolID")} cursor="pointer">
                    ID{" "}
                    {sortBy.column === "KolID" &&
                      (sortBy.order === "asc" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      ))}
                  </Th>
                  <Th onClick={() => sortData("Education")} cursor="pointer">
                    Education{" "}
                    {sortBy.column === "Education" &&
                      (sortBy.order === "asc" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      ))}
                  </Th>
                  <Th onClick={() => sortData("Language")} cursor="pointer">
                    Language{" "}
                    {sortBy.column === "Language" &&
                      (sortBy.order === "asc" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      ))}
                  </Th>
                  <Th onClick={() => sortData("ExpectedSalary")} cursor="pointer">
                    Expected Salary{" "}
                    {sortBy.column === "ExpectedSalary" &&
                      (sortBy.order === "asc" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      ))}
                  </Th>
                  <Th onClick={() => sortData("VerificationStatus")} cursor="pointer">
                    Verified{" "}
                    {sortBy.column === "VerificationStatus" &&
                      (sortBy.order === "asc" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      ))}
                  </Th>
                  <Th onClick={() => sortData("LivenessStatus")} cursor="pointer">
                    Liveness Status{" "}
                    {sortBy.column === "LivenessStatus" &&
                      (sortBy.order === "asc" ? (
                        <ArrowUpIcon />
                      ) : (
                        <ArrowDownIcon />
                      ))}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedKols.map((kol, index) => (
                  <Tr key={kol.KolID} onClick={() => openModal(index)} cursor="pointer">
                    <Td>{kol.KolID}</Td>
                    <Td>{kol.Education}</Td>
                    <Td>{kol.Language === "Vietnamese" ? "VN" : "EN"}</Td>
                    <Td>{kol.ExpectedSalaryEnable ? kol.ExpectedSalary : "N/A"}</Td>
                    <Td>
                      {kol.VerificationStatus === "Verified" ? (
                        <CheckCircleIcon color="green.500" />
                      ) : (
                        <NotAllowedIcon color="red.500" />
                      )}
                    </Td>
                    <Td>
                      {kol.LivenessStatus === "Passed" ? (
                        <CheckCircleIcon color="green.500" />
                      ) : (
                        <NotAllowedIcon color="red.500" />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Trang trước
        </Button>
        <Box>
          Trang{" "}
          <Input
            type="number"
            value={currentPage}
            onChange={handlePageChange}
            width="60px"
            display="inline-block"
            textAlign="center"
          />{" "}
          / {totalPages}
        </Box>
        <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Trang sau
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thông tin chi tiết KOL</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="400px" overflow="auto">
            {" "}
            {selectedKolIndex !== null && (
			
			<Box>
			  <Heading as="h3" size="md">
				Thông tin cá nhân
			  </Heading>
			  <p>ID: {kols[selectedKolIndex]?.KolID}</p>
			  <p>Giáo dục: {kols[selectedKolIndex].Education}</p>
			  <p>
				Ngôn ngữ:{" "}
				{kols[selectedKolIndex].Language === "Vietnamese" ? "VN" : "EN"}
			  </p>
			  <Heading as="h3" size="md" mt={4}>
				Chi tiết công việc
			  </Heading>
			  <p>
				Mức lương mong muốn:{" "}
				{kols[selectedKolIndex].ExpectedSalaryEnable
				  ? kols[selectedKolIndex].ExpectedSalary
				  : "N/A"}
			  </p>
			  <p>
				Trạng thái xác minh:{" "}
				{kols[selectedKolIndex].VerificationStatus === "Verified" ? (
				  <CheckCircleIcon color="green.500" />
				) : (
				  <NotAllowedIcon color="red.500" />
				)}
			  </p>
			  <p>
				Trạng thái liveness:{" "}
				{kols[selectedKolIndex].LivenessStatus === "Passed" ? (
				  <CheckCircleIcon color="green.500" />
				) : (
				  <NotAllowedIcon color="red.500" />
				)}
			  </p>
			  <Heading as="h3" size="md" mt={4}>
				Thông tin khác
			  </Heading>
			  <p>UserProfileID: {kols[selectedKolIndex].UserProfileID}</p>
			  <p>
				ChannelSettingTypeID: {kols[selectedKolIndex].ChannelSettingTypeID}
			  </p>
			  <p>RewardID: {kols[selectedKolIndex].RewardID}</p>
			  <p>PaymentMethodID: {kols[selectedKolIndex].PaymentMethodID}</p>
			  <p>TestimonialsID: {kols[selectedKolIndex].TestimonialsID}</p>
			  <p>
				Đang hoạt động:{" "}
				{kols[selectedKolIndex].Enabled ? (
				  <CheckCircleIcon color="green.500" />
				) : (
				  <NotAllowedIcon color="red.500" />
				)}
			  </p>
			  <p>
				Ngày kích hoạt:{" "}
				{new Date(kols[selectedKolIndex].ActiveDate).toLocaleDateString()}
			  </p>
			  <p>
				Hoạt động:{" "}
				{kols[selectedKolIndex].Active ? (
				  <CheckCircleIcon color="green.500" />
				) : (
				  <NotAllowedIcon color="red.500" />
				)}
			  </p>
			  <p>Người tạo: {kols[selectedKolIndex].CreatedBy}</p>
			  <p>
				Ngày tạo:{" "}
				{new Date(kols[selectedKolIndex].CreatedDate).toLocaleDateString()}
			  </p>
			  <p>Người sửa đổi: {kols[selectedKolIndex].ModifiedBy}</p>
			  <p>
				Ngày sửa đổi:{" "}
				{new Date(kols[selectedKolIndex].ModifiedDate).toLocaleDateString()}
			  </p>
			  <p>
				Đã xóa:{" "}
				{kols[selectedKolIndex].IsRemove ? (
				  <CheckCircleIcon color="green.500" />
				) : (
				  <NotAllowedIcon color="red.500" />
				)}
			  </p>
			  <p>
				Đang onboarding:{" "}
				{kols[selectedKolIndex].IsOnBoarding ? (
				  <CheckCircleIcon color="green.500" />
				) : (
				  <NotAllowedIcon color="red.500" />
				)}
			  </p>
			  <p>Mã: {kols[selectedKolIndex].Code}</p>
			  <p>
				URL chân dung phải:{" "}
				<a
				  href={kols[selectedKolIndex].PortraitRightURL}
				  target="_blank"
				  rel="noopener noreferrer"
				>
				  Link
				</a>
			  </p>
			  <p>
				URL chân dung trái:{" "}
				<a
				  href={kols[selectedKolIndex].PortraitLeftURL}
				  target="_blank"
				  rel="noopener noreferrer"
				>
				  Link
				</a>
			  </p>
			  <p>
				URL mặt trước CMND:{" "}
				<a
				  href={kols[selectedKolIndex].IDFrontURL}
				  target="_blank"
				  rel="noopener noreferrer"
				>
				  Link
				</a>
			  </p>
			  <p>
				URL mặt sau CMND:{" "}
				<a
				  href={kols[selectedKolIndex].IDBackURL}
				  target="_blank"
				  rel="noopener noreferrer"
				>
				  Link
				</a>
			  </p>
			  <p>
				URL chân dung:{" "}
				<a
				  href={kols[selectedKolIndex].PortraitURL}
				  target="_blank"
				  rel="noopener noreferrer"
				>
				  Link
				</a>
			  </p>
			</Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              mr={4}
              onClick={() =>
                setSelectedKolIndex((prev) => (prev && prev > 0 ? prev - 1 : 0))
              }
              disabled={selectedKolIndex === 0}
            >
              Trước
            </Button>
            <Button
              onClick={() =>
                setSelectedKolIndex((prev) =>
                  prev !== null && prev < kols.length - 1 ? prev + 1 : prev
                )
              }
              disabled={selectedKolIndex === kols.length - 1}
            >
              Sau
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Page;
