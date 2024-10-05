"use client"

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
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";

interface Kols {
  KolID: number;
  UserProfileID: number;
  Language: string;
  Education: string;
  ExpectedSalary: number;
  ExpectedSalaryEnable: boolean;
  VerificationStatus: string;
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
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang từ backend
  const [loading, setLoading] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const tableRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchKols(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]); // Cập nhật khi số trang hoặc số hàng mỗi trang thay đổi

  const fetchKols = async (pageIndex: number, pageSize: number) => {
    setLoading(true); // Bắt đầu tải dữ liệu
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/kols?pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
      setKols(response.data.kol); // Dữ liệu KOL từ backend
      setTotalPages(Math.ceil(response.data.totalCount / pageSize)); // Tính toán tổng số trang
    } catch (error) {
      console.error("Error fetching KOLs:", error);
    } finally {
      setLoading(false); // Kết thúc tải dữ liệu
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

      // Tự động chuyển trang khi cuộn tới cuối hoặc đầu trang
      if (direction === "down" && scrollPosition >= maxScrollPosition - 5) {
        if (currentPage < totalPages) {
          setCurrentPage((prev) => prev + 1);
          tableRef.current.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn về đầu trang mới
        }
      }

      if (direction === "up" && scrollPosition <= 5) {
        if (currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
          tableRef.current.scrollTo({ top: tableRef.current.scrollHeight, behavior: "smooth" }); // Cuộn về cuối trang trước
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
      >
        <Heading as="h1">KoL List</Heading>
        <IconButton
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          aria-label="Toggle dark mode"
          onClick={toggleColorMode}
        />
      </Box>

      <Box
        mb={5}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
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
            <Table variant="simple">
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
                  <Tr key={kol.KolID}>
                    <Td>{kol.KolID}</Td>
                    <Td>{kol.Education}</Td>
                    <Td>{kol.Language === "Vietnamese" ? "VN" : "EN"}</Td>
                    <Td>
                      {kol.ExpectedSalaryEnable ? kol.ExpectedSalary : "N/A"}
                    </Td>
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
    </Box>
  );
};

export default Page;
