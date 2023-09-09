import { Card, CardHeader, CardBody, SkeletonCircle, Heading, Box , 
    SkeletonText, Flex, IconButton, Spacer, Select, Stack, Text, Avatar} from '@chakra-ui/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import {BigCalendarPops, DisplayScheduleWeek} from "./interface";

const dayOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const month = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม","พฤศจิกายน","ธันวาคม"];

function getDayOfWeek(currDate: Date){ //use to modify Monday to be index 0, originally, Sunday is index 0.
    let num: number = 0;
    if(currDate.getDay() === 0){
        num = 6;
    }
    else{
        num = currDate.getDay()-1;
    }
    return num;
}

function get7Dates(currDate: Date): Date[]{
    const datesOfWeek: Date[] = [];
    const dayIndex = getDayOfWeek(currDate);
    for(let i = 0; i<7; i++){
        const newDate = new Date(currDate);
        if(i !== dayIndex){
            newDate.setDate(currDate.getDate()-dayIndex+i);
        }
        datesOfWeek.push(newDate);
    }
    return datesOfWeek;
}

function replaceHyphens(inputString: string) {
    return inputString.replace(/\u2010/g, '-');
}

function formattedTime(hr: number, mins: number): string{
    const formattedHour = hr < 10 ? `0${hr}` : `${hr}`;
    const formattedMinute = mins < 10 ? `0${mins}` : `${mins}`;
    const formattedTime = `${formattedHour}:${formattedMinute}`;
    return formattedTime;
}

function getScheduleOfWeek({displayDates, teacherSchedule} : DisplayScheduleWeek) : string[][]{
    const scheduleOfWeek: string[][] = [];
    displayDates.forEach((date) => {
        const scheduleOfDay: string[] = [];
        teacherSchedule.forEach(entry => {
            entry.class_schedule.forEach(schedule => {
                const startClass = new Date(replaceHyphens(schedule.st_time));
                const endClass = new Date(replaceHyphens(schedule.en_time));
                if(startClass.toDateString() === date.toDateString()){
                    const startAt = formattedTime(startClass.getHours(), startClass.getMinutes());
                    const endAt = formattedTime(endClass.getHours(), endClass.getMinutes());
                    const res = `${startAt}-${endAt}-${entry.subject}-${entry.edu_level}-${schedule.class_order}-${entry.student_profile}`;
                    scheduleOfDay.push(res);
                }
            })
        })
        scheduleOfWeek.push(scheduleOfDay);
    })
    return scheduleOfWeek;
}

function changeColorSubject(room: string){
    let roomMath = false;
    let roomSci = false;
    let roomEng = false;
    if(room === "คณิตศาสตร์"){
        roomMath = true;
    }
    else if(room === "วิทยาศาสตร์"){
        roomSci = true;
    }
    else if(room === "อังกฤษ"){
        roomEng = true;
    }
    return [roomMath, roomSci, roomEng];
}

function timeInterval(showTime: string[][]){
    const timeInterval: string[] = [];
    showTime.forEach((data) => {
        data.forEach(time => {
            const[start, end] = time.split("-");
            if(!timeInterval.includes(start)){
                timeInterval.push(start);
            }
            if(!timeInterval.includes(end)){
                timeInterval.push(end);
            }
        }) 
    })
    return timeInterval;
}

function ShowTimeSlot({ scheduleOfEachDates }: { scheduleOfEachDates: string[][] }){
    let previousTime: number = 0;
    return(
        <Flex>
            {scheduleOfEachDates.map((eachDay, index) => { 
                if(eachDay.length === 0){ //show empty slot
                    return(     
                        <Stack flex="1" key={index}>
                            <Box flex="1" textAlign="center" h={{ md: 40, lg: 40 }} >
                            </Box>
                        </Stack> 
                    )
                }
                else{
                    return(
                        <Stack flex="1" key={index}>
                        {
                        eachDay.map((time, index) => { //show schedule slot
                            const[start, end, subject, edu_level, class_order, student_profile] = time.split("-");
                            const roomSubject = changeColorSubject(subject);
                            const timeIndex = timeInterval(scheduleOfEachDates);
                            const startTimeSlot = timeIndex.findIndex(time => time === start);
                            const endTimeSlot = timeIndex.findIndex(time => time === end);  
                            const prevEndTime = index > 0 ? previousTime : 0;    
                            previousTime = endTimeSlot;                  
                            return(
                                <Stack
                                key={time}
                                bg={roomSubject[0] ? "orange.100" : roomSubject[1] ? "green.100" : "purple.100"}
                                borderLeft= {roomSubject[0] ? '5px solid tomato' : roomSubject[1] ? '5px solid green' : '5px solid purple'}
                                h={{ base: 40 *(Math.abs(endTimeSlot-startTimeSlot)), lg: 44 *(Math.abs(endTimeSlot-startTimeSlot)), xl: 36 *(Math.abs(endTimeSlot-startTimeSlot)) }}
                                mt={startTimeSlot === 0 ? 0 : {base: 40*(Math.abs(prevEndTime - startTimeSlot)), lg: 44*(Math.abs(prevEndTime - startTimeSlot)), xl: 36*(Math.abs(prevEndTime - startTimeSlot))} }
                                alignItems="left"
                                textAlign="left"
                                >
                                    <Stack gap={2} p={2}>
                                        <Flex fontSize={{xs: "md", sm: "xs"}} flexWrap="wrap">
                                            <Text display={{sm: "none", xl: "block"}}>วิชา</Text>
                                            <Text>{subject} </Text>
                                            <Text pl={1}>{edu_level}</Text>
                    
                                        </Flex>
                                        <Text fontSize={{xs: "md", sm: "xs"}}>
                                        ครั้งที่ {class_order}
                                        </Text>
                                        <Avatar display={{base: "block", sm: "none", md: "block"}} size="md" src="https://bit.ly/dan-abramov"/> {/*{student_profile} */}
                                        <Text fontSize={{xs: "md", sm: "xs"}}>
                                        {start}-{end} 
                                        </Text>
                                    </Stack>
                                </Stack>
                            )
                        })
                        }
                        </Stack>
                    )
                }
            })}  
        </Flex>
    )
}

export default function BigCalender({teacherSchedule, loading, screenWidth} : BigCalendarPops){
    const today = new Date();
    const[dateCalendar, setDateCalendar] = useState<Date>(today);
    const displayDates: Date[] = screenWidth < 730 ? [dateCalendar] : get7Dates(dateCalendar);
    const scheduleOfEachDates = getScheduleOfWeek({displayDates, teacherSchedule});
    const timeSlotLabel = timeInterval(scheduleOfEachDates);

    const handleChangeDate = (e: string) =>{
        if(e === "prev"){
            const newDate = new Date(dateCalendar);
            newDate.setDate(newDate.getDate() - (screenWidth < 730 ? 1 : 7));
            setDateCalendar(newDate);
        }
        else if(e === "next"){
            const newDate = new Date(dateCalendar);
            newDate.setDate(newDate.getDate() + (screenWidth < 730 ? 1 : 7));
            setDateCalendar(newDate);
        }
    }
    return(
        <Card>
            {loading ? 
              (<Box padding='6' boxShadow='lg' bg='white'>
                  <SkeletonCircle size='10' />
                  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
                </Box>
              ) : (
                <>
                <CardHeader>
                    <Box display="flex" flexDirection={{base: "column", xs: "row"}} flex='1' gap='4' alignItems='center'>
                        <Flex gap={2}>
                            <Heading size='lg'>
                                {dateCalendar.getDate()}
                            </Heading>
                            <Heading size='lg'>
                                {month[dateCalendar.getMonth()]}
                            </Heading>
                            <Heading size='lg'>
                                {dateCalendar.getFullYear()}
                            </Heading>
                        </Flex>
                        <Box display="flex" flex="1" flexDirection={{base: "column", xs: "row"}}>
                            <Flex gap={5} m={1}>
                                <IconButton
                                    variant='ghost'
                                    colorScheme='gray'
                                    aria-label='prev'
                                    icon={<ChevronLeftIcon boxSize={6}/>}
                                    onClick={() => handleChangeDate("prev")}
                                />
                                <IconButton
                                    variant='ghost'
                                    colorScheme='gray'
                                    aria-label='next'
                                    icon={<ChevronRightIcon boxSize={6}/>}
                                    onClick={() => handleChangeDate("next")}
                                />
                            </Flex>
                            <Spacer />
                            <Select w={{base: 24, lg: 52}} size="md">
                                <option value='option1'>Week</option>
                            </Select>
                        </Box>
                    </Box>
                </CardHeader>
                <CardBody>
                    <Flex w="100%">
                        <Stack w={{sm: "10%", base: "25%"}} textAlign="center" gap={0} mt={20}>
                            {timeSlotLabel.map((time, index) => ( //show time label at the left
                                index === timeSlotLabel.length-1 ? (
                                    <Box h={5} key={time}>
                                        {time}
                                    </Box> 
                                ):(
                                    <Box h={{ base: 40, lg: 44, xl: 36 }} key={time}>
                                        {time}
                                    </Box> 
                                )
                            ))}
                        </Stack>
                        <Stack w={{sm: "90%", base: "75%"}}>
                            <Flex bg="gray.200" borderRadius={5} h={20} alignItems="center">
                            {screenWidth < 730 ? (
                                <Box flex="1" textAlign="center">
                                    <Heading size="md" color="orange.500">
                                        {displayDates[0].getDate()}
                                    </Heading>
                                    <Text color="orange.500">
                                        {dayOfWeek[getDayOfWeek(displayDates[0])]}
                                    </Text>
                                </Box>
                            ) : (dayOfWeek.map((day, index) => ( dateCalendar.toDateString() === displayDates[index].toDateString() ?
                                (
                                <Box key={day} flex="1" textAlign="center">
                                    <Heading size={{lg: "md", base: "sm"}} color="orange.500">
                                        {displayDates[index].getDate()}
                                    </Heading>
                                    <Text color="orange.500">
                                        {day}
                                    </Text>
                                </Box>
                                ) : (
                                <Box key={day} flex="1" textAlign="center">
                                    <Heading size={{lg: "md", base: "sm"}}>
                                        {displayDates[index].getDate()}
                                    </Heading>
                                    <Text color="gray.500">
                                        {day}
                                    </Text>
                                </Box>
                                )))
                            )
                            }
                            </Flex>
                            <ShowTimeSlot scheduleOfEachDates={scheduleOfEachDates}/>
                        </Stack>
                    </Flex>
                </CardBody>
                </>
            )}
        </Card>
    )
}