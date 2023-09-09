import { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Card, CardHeader, CardBody, Text, Heading, Box , Stack, StackDivider} from '@chakra-ui/react';
import { Grid } from '@chakra-ui/react';
import { Button, ButtonGroup, Avatar, useDisclosure, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { Flex, Spacer, Divider } from '@chakra-ui/react'
import {CalendarIcon, ChevronRightIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import { TeacherScheduleProps, TimeSchedule, UpdateSchedule } from './interface';

function getNextDayOfWeek(dayOfWeek: string){ //เช่น อยากได้วันจันทร์ที่จะถึง หรือ วันอังคารที่จะถึง ไม่เอาวันที่ผ่านไปแล้ว
    const days: string[] = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
    const index: number = days.findIndex((item: string) => item === dayOfWeek);
    const today: Date = new Date();
    const daysUntilNextDay: number = (index - today.getDay() + 7) % 7;
    const nextDay: Date = new Date(today);
    nextDay.setDate(today.getDate() + daysUntilNextDay);
    return nextDay;
  }
  
export default function TeacherSchedule({teacherSchedule, loading, screenWidth} : TeacherScheduleProps){
   
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>("วันจันทร์");
  
    const dayOfWeek: string[] = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];
    const dayOfWeekShort: string[] = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];
    const timeSchedule: TimeSchedule = {
      morning: ["07:00 - 07:50", "08:00 - 08:50", "09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50"],
      afternoon: ["12:00 - 12:50", "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50"],
      evening: ["16:00 - 16:50", "17:00 - 17:50", "18:00 - 18:50", "19:00 - 19:50"],
      night: ["20:00 - 20:50", "21:00 - 21:50", "22:00 - 22:50", "23:00 - 23:50"]
    };
  
    const handleToggle = (name: string) =>{  
      if (selectedButtons.includes(name)) {
        setSelectedButtons(selectedButtons.filter((btn) => btn !== name));
      } else {
        setSelectedButtons([...selectedButtons, name]);
      }
    }
  
    const handleSubmit = () =>{
      const originalDate = getNextDayOfWeek(selectedDay);
      const updatedData: UpdateSchedule = {date: originalDate, schedule: selectedButtons};
      if(selectedButtons.length !== 0){
        console.log(updatedData);
        axios.put('https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-5fbd0ad5-e0a9-488e-9b8d-b8ed9c78f6a1/default/skill-test-api/teacher/time-slot', updatedData)
        .then(response => {
          console.log('PUT request successful:', response.data);
        })
        .catch(error => {
          console.error('Error making PUT request:', error);
        });
      }
      onClose();
    }
  
    return (
      <>
        <Card maxH='md' overflow="auto" w="100%" >
          <CardHeader>
            <Flex alignItems="center">
              <Heading size='md'>ตารางสอน</Heading>
              <Spacer />
              <Button onClick={onOpen} colorScheme='teal' size='sm' borderRadius="25px">อัพเดทตารางสอน</Button>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
              {loading ? 
                (<Box padding='6' boxShadow='lg' bg='white'>
                    <SkeletonCircle size='10' />
                    <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
                  </Box>
                ) :
                teacherSchedule.map((item, index) => (
                  <Button key={index} h="auto" p={3} gap={{base: 0, xs: 5}} leftIcon={<CalendarIcon boxSize={{lg: 8, base: 6}}/>}>
                    <Flex gap={5}>
                      <Stack textAlign="left">
                        <Heading size='xs'>
                          วิชา{item.subject} {item.edu_level}
                        </Heading>
                        <Flex gap={2} alignItems="center">
                          <Text fontSize='sm'>
                            ผู้เรียน
                          </Text>
                          <Avatar size='sm' name={item.student_name} src="https://bit.ly/dan-abramov" /> {/* src={item.student_profile} error 404*/}
                          <Text fontSize='sm'>
                            {item.student_name}
                          </Text>
                        </Flex>
                      </Stack>
                    </Flex>
                    <Spacer />
                    <ChevronRightIcon color="orange.500"/>
                  </Button>
                ))
              }
            </Stack>
          </CardBody>
        </Card>
  
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size={{sm:"2xl" ,base: "full"}}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex alignItems='center'>
                <Text fontSize='2xl'>จัดตารางสอน</Text>
                <WarningIcon ml={2} color="gray.500" boxSize={4}/>
              </Flex>
              <Text fontSize='xs' color='gray.500'>โปรดเลือกวันและเวลาที่ต้องการ</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex h="auto" borderRadius="10px" border='1px' borderColor='gray.300'>
                <Stack w='30%'>
                  <ButtonGroup size='sm' isAttached variant='outline' flexDirection="column" h="100%">
                    { screenWidth < 450 ? (dayOfWeekShort.map(day => (
                        <Button onClick={() => {setSelectedDay(day); setSelectedButtons([]);}} key={day} flex='1' borderRight={day===selectedDay ? "none" : ""}>
                          <Box as="span" flex='1' textAlign='left'>
                            {day}
                          </Box>
                          <ChevronRightIcon boxSize={5}/>
                        </Button>
                        )))
                      :
                      (dayOfWeek.map(day => (
                        <Button onClick={() => {setSelectedDay(day); setSelectedButtons([]);}} key={day} flex='1' borderRight={day===selectedDay ? "none" : ""}>
                          <Box as="span" flex='1' textAlign='left'>
                            {day}
                          </Box>
                          <ChevronRightIcon boxSize={5}/>
                        </Button>
                      )))
                    }
                  </ButtonGroup>
                </Stack>
  
                <Stack w='70%' p={5}>
                <Box flex='1'>
                    <Text fontSize='sm'>
                      ช่วงเช้า
                    </Text>
                    <Flex flexWrap="wrap" gap={1}>
                    {
                      timeSchedule.morning.map(schedule => (
                        <Button onClick={() => handleToggle(schedule)} key={schedule} colorScheme={selectedButtons.includes(schedule) ? 'green' : 'gray'} size='xs' >
                          {schedule}
                        </Button>
                      ))
                    }
                    </Flex>
                  </Box>
  
                  <Box flex='1'>
                    <Text fontSize='sm'>
                      ช่วงบ่าย
                    </Text>
                    <Flex flexWrap="wrap" gap={1}>
                    {
                      timeSchedule.afternoon.map(schedule => (
                        <Button onClick={() => handleToggle(schedule)} key={schedule} colorScheme={selectedButtons.includes(schedule) ? 'green' : 'gray'} size='xs' >
                          {schedule}
                        </Button>
                      ))
                    }
                    </Flex>
                  </Box>
  
                  <Box flex='1'>
                    <Text fontSize='sm'>
                      ช่วงเย็น
                    </Text>
                    <Flex flexWrap="wrap" gap={1}>
                    {
                      timeSchedule.evening.map(schedule => (
                        <Button onClick={() => handleToggle(schedule)} key={schedule} colorScheme={selectedButtons.includes(schedule) ? 'green' : 'gray'} size='xs' >
                          {schedule}
                        </Button>
                      ))
                    }
                    </Flex>
                  </Box>
  
                  <Box flex='1'>
                    <Text fontSize='sm'>
                      ช่วงกลางคืน
                    </Text>
                    <Flex flexWrap="wrap" gap={1}>
                    {
                      timeSchedule.night.map(schedule => (
                        <Button onClick={() => handleToggle(schedule)} key={schedule} colorScheme={selectedButtons.includes(schedule) ? 'green' : 'gray'} size='xs' >
                          {schedule}
                        </Button>
                      ))
                    }
                    </Flex>
                  </Box>
                </Stack>
              </Flex>
              <Box w='90%' p={3}>
                <Text fontSize="xs">
                  <Box as="span" color="tomato">หมายเหตุ:</Box>
                  โปรดอัพเดทตารางสอนให้เป็นประจำอยู่เสมอ เพื่อรับงานสอนได้ต่อเนื่อง
                  หากไม่อัพเดทตารางสอนอาจถูกพิจารณาในการรับงานสอนในแต่ละครั้ง
                </Text>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                ตกลง
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
  