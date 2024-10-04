"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  SkeletonText,
  Flex,
} from '@chakra-ui/react';
import { CheckCircleIcon, NotAllowedIcon, ArrowUpIcon, ArrowDownIcon, SunIcon, MoonIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

interface Kols {
  KolID: number;
  Education: string;
  Language: string;
  ExpectedSalary: number;
  ExpectedSalaryEnable: boolean;
  VerificationStatus: string;
  LivenessStatus: string;
  UserProfileID: number;
  ChannelSettingTypeID: number;
  RewardID: number;
  PaymentMethodID: number;
  TestimonialsID: number;
  Enabled: boolean;
  ActiveDate: Date;
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
  const [selectedKolIndex, setSelectedKolIndex] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const [loading, setLoading] = useState(true);
  const tableRef = React.useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(kols.length / rowsPerPage); // Tính tổng số trang

  useEffect(() => {
    fetchKols();
  }, []);

  const fetchKols = async () => {
    try {
      setLoading(true); // Bắt đầu tải
      const response = await axios.get('https://testing-weallnet.vercel.app/kols?pageIndex=1&pageSize=40');
      setKols(response.data.kol);
    } catch (error) {
      console.error("Error fetching KOLs:", error);
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  const sortData = (column: string) => {
    const order = sortBy.column === column && sortBy.order === "asc" ? "desc" : "asc";
    setSortBy({ column, order });
  };

  const filteredKols = kols.filter((kol) => {
    const searchText = filterText.toLowerCase();
    return (
      kol.KolID.toString().toLowerCase().includes(searchText) ||
      kol.Education.toLowerCase().includes(searchText) ||
      kol.Language.toLowerCase().includes(searchText) ||
      (kol.ExpectedSalaryEnable && kol.ExpectedSalary.toString().includes(searchText)) ||
      kol.VerificationStatus.toLowerCase().includes(searchText) ||
      kol.LivenessStatus.toLowerCase().includes(searchText)
    );
  });

  const sortedKols = filteredKols
    .sort((a, b) => {
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
    })
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const openModal = (index: number) => {
    setSelectedKolIndex(index);
    onOpen();
  };

  const scrollTable = (direction: 'up' | 'down') => {
    if (tableRef.current) {
      const scrollAmount = direction === 'up' ? -30 : 30; // Scroll by 30px
      tableRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Box p={5} bg={bgColor} minHeight="100vh">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
        <Heading as="h1">KoL List</Heading>
        <Box display="flex" alignItems="center">
          <IconButton
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            aria-label="Toggle dark mode"
            onClick={toggleColorMode}
          />
        </Box>
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
            onClick={() => scrollTable('up')}
          />
          <IconButton
            ml={4}
            icon={<ChevronDownIcon />}
            aria-label="Scroll down"
            onClick={() => scrollTable('down')}
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
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Table variant="simple" position="relative">
              <Thead position="sticky" top={0} zIndex={10} bg={bgColor}>
                <Tr>
                  <Th onClick={() => sortData("KolID")} cursor="pointer">
                    ID {sortBy.column === "KolID" && (sortBy.order === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  </Th>
                  <Th onClick={() => sortData("Education")} cursor="pointer">
                    Education {sortBy.column === "Education" && (sortBy.order === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  </Th>
                  <Th onClick={() => sortData("Language")} cursor="pointer">
                    Language {sortBy.column === "Language" && (sortBy.order === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  </Th>
                  <Th onClick={() => sortData("ExpectedSalary")} cursor="pointer">
                    Expected Salary {sortBy.column === "ExpectedSalary" && (sortBy.order === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  </Th>
                  <Th onClick={() => sortData("VerificationStatus")} cursor="pointer">
                    Verified {sortBy.column === "VerificationStatus" && (sortBy.order === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  </Th>
                  <Th onClick={() => sortData("LivenessStatus")} cursor="pointer">
                    Liveness Status {sortBy.column === "LivenessStatus" && (sortBy.order === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedKols.map((kol, index) => (
                  <Tr key={kol.KolID} onClick={() => openModal(index)} cursor="pointer">
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
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trang trước
        </Button>
        <Box>
          Trang <Input type="number" value={currentPage} onChange={handlePageChange} width="60px" display="inline-block" textAlign="center" /> / {totalPages}
        </Box>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Trang sau
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thông tin chi tiết KOL</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="400px" overflow="auto"> {/* Scroll cho modal */}
            {selectedKolIndex !== null && (
              <Box>
                <Heading as="h3" size="md">Thông tin cá nhân</Heading>
                <p>ID: {kols[selectedKolIndex].KolID}</p>
                <p>Giáo dục: {kols[selectedKolIndex].Education}</p>
                <p>Ngôn ngữ: {kols[selectedKolIndex].Language === "Vietnamese" ? "VN" : "EN"}</p>
                <Heading as="h3" size="md" mt={4}>Chi tiết công việc</Heading>
                <p>Mức lương mong muốn: {kols[selectedKolIndex].ExpectedSalaryEnable ? kols[selectedKolIndex].ExpectedSalary : "N/A"}</p>
                <p>Trạng thái xác minh: {kols[selectedKolIndex].VerificationStatus}</p>
                <p>Trạng thái liveness: {kols[selectedKolIndex].LivenessStatus}</p>
                <Heading as="h3" size="md" mt={4}>Thông tin khác</Heading>
                <p>UserProfileID: {kols[selectedKolIndex].UserProfileID}</p>
                <p>ChannelSettingTypeID: {kols[selectedKolIndex].ChannelSettingTypeID}</p>
                <p>RewardID: {kols[selectedKolIndex].RewardID}</p>
                <p>PaymentMethodID: {kols[selectedKolIndex].PaymentMethodID}</p>
                <p>TestimonialsID: {kols[selectedKolIndex].TestimonialsID}</p>
                <p>Enabled: {kols[selectedKolIndex].Enabled ? "Yes" : "No"}</p>
                <p>Ngày kích hoạt: {new Date(kols[selectedKolIndex].ActiveDate).toLocaleDateString()}</p>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={4} onClick={() => setSelectedKolIndex((prev) => (prev && prev > 0 ? prev - 1 : 0))} disabled={selectedKolIndex === 0}>
              Trước
            </Button>
            <Button onClick={() => setSelectedKolIndex((prev) => (prev !== null && prev < kols.length - 1 ? prev + 1 : prev))} disabled={selectedKolIndex === kols.length - 1}>
              Sau
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Page;
