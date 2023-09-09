import { Card, CardHeader, CardBody, SkeletonCircle, Heading, Box , SkeletonText, Flex, IconButton, Spacer, Grid, GridItem} from '@chakra-ui/react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import {MiniCalendarProps, DisplayDateCalendar} from "./interface";
import React from 'react';

const dayOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const month = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม","พฤศจิกายน","ธันวาคม"];

function getLastDateOfMonth(currMonth: Date){
    const lastDate = new Date(currMonth.getFullYear(), currMonth.getMonth()+1, 1);
    lastDate.setDate(lastDate.getDate()-1);
    return lastDate.getDate();
}

function getFirstDayOfMonth(currMonth: Date){
    const firstDate = new Date(currMonth.getFullYear(), currMonth.getMonth(), 1);
    let num: number = 0;
    if(firstDate.getDay() === 0){
        num = 6;
    }
    else{
        num = firstDate.getDay()-1;
    }
    return num;
}

function eachDateOfMonth(currMonth: Date) : Date[]{
    const dates: Date[] = [];
    const firstDate = new Date(currMonth.getFullYear(), currMonth.getMonth(), 1);
    let maxShowDate:number = getLastDateOfMonth(currMonth) + getFirstDayOfMonth(currMonth);
    if(maxShowDate % 7 !== 0){
        maxShowDate = maxShowDate + (7-(maxShowDate)%7);
    }
    for(let i = 0; i<maxShowDate; i++){
        const currentDate = new Date(firstDate);
        if(i !== getFirstDayOfMonth(currMonth)){
            currentDate.setDate(currentDate.getDate() - getFirstDayOfMonth(currMonth) + i);
        }
        dates.push(currentDate);
    }
    return dates;
}

function replaceHyphens(inputString: string) {
    return inputString.replace(/\u2010/g, '-');
}

function DisplayDate({teacherSchedule, dateCalendar}: DisplayDateCalendar){
    const today = new Date();
    const allDays: Date[] = eachDateOfMonth(dateCalendar);
    let firstDayOfMonth: number = getFirstDayOfMonth(dateCalendar);
    let lastDateOfMonth: number = getLastDateOfMonth(dateCalendar);

    return (
        <>
        {allDays.map((date, index) => {    
            return(
                <GridItem 
                    key={index} 
                    flex="1" 
                    h={10}
                    textAlign="center" 
                    alignItems="center"
                    borderRadius={5}
                    color={index < firstDayOfMonth || index > lastDateOfMonth+firstDayOfMonth-1 ? "gray.300" : date.toDateString() === today.toDateString() ? "white" : "blackAlpha.700"} 
                    fontWeight={index < firstDayOfMonth || index > lastDateOfMonth+firstDayOfMonth-1 ? "normal" : "bold"} 
                    bg = {date.toDateString() === today.toDateString() ? "blue.500" : "none"}
                >
                    {date.getDate()}
                    <Flex flex='1' alignItems="center" gap={1} textAlign="center" justifyContent="center">

                    {teacherSchedule.map((data) => data.class_schedule.map(day => {
                        const d = replaceHyphens(day.en_time);
                        const newDate = new Date(d); 
                        let subjectMath = false;
                        let subjectSci = false;
                        let subjectEng = false;
                        if(newDate.toDateString() === date.toDateString()){
                            if(data.subject === "คณิตศาสตร์"){
                                subjectMath = true;
                            }
                            else if(data.subject === "วิทยาศาสตร์"){
                                subjectSci = true;
                            }
                            else if(data.subject === "อังกฤษ"){
                                subjectEng = true;
                            }
                        }
                        return ( 
                            <React.Fragment key={`${data.order_id}-${day.en_time}`}>
                                {subjectMath ? <Box bg="tomato" borderRadius="50%" boxSize={1}></Box> : <></>}
                                {subjectSci ? <Box bg="green" borderRadius="50%" boxSize={1}></Box> : <></>}
                                {subjectEng ? <Box bg="black" borderRadius="50%" boxSize={1}></Box> : <></>}
                            </React.Fragment>
                        )
                    }))}
                    </Flex>                   
                </GridItem>
            )
        })} 
        </>
    )
}

export default function MiniCalender({teacherSchedule, loading} : MiniCalendarProps){
    const today = new Date();
    const[dateCalendar, setDateCalendar] = useState<Date>(today);

    const handleChangeMonth = (e: string) =>{
        if(e === "prev"){
            const newDate = new Date(dateCalendar);
            newDate.setMonth(newDate.getMonth() - 1);
            setDateCalendar(newDate);
        }
        else if(e === "next"){
            const newDate = new Date(dateCalendar);
            newDate.setMonth(newDate.getMonth() + 1);
            setDateCalendar(newDate);
        }
    }
    return(
        <Card w="100%">
            {loading ? 
              (<Box padding='6' boxShadow='lg' bg='white'>
                  <SkeletonCircle size='10' />
                  <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
                </Box>
              ) : (
                <>
                <CardHeader>
                    <Flex flex='1' gap='4' alignItems='center'>
                        <Heading size='md'>
                            {month[dateCalendar.getMonth()]}
                        </Heading>
                        <Heading size='md'>
                            {dateCalendar.getFullYear()}
                        </Heading>
                        <Spacer />
                    <IconButton
                            variant='ghost'
                            colorScheme='gray'
                            aria-label='prev'
                            icon={<ChevronLeftIcon/>}
                            onClick={() => handleChangeMonth("prev")}
                    />
                    <IconButton
                            variant='ghost'
                            colorScheme='gray'
                            aria-label='next'
                            icon={<ChevronRightIcon />}
                            onClick={() => handleChangeMonth("next")}
                    />
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Grid templateColumns='repeat(7, 1fr)'>
                        {dayOfWeek.map((day) => (
                            <GridItem key={day} flex="1" textAlign="center">
                                {day}
                            </GridItem>
                        ))}
                        <DisplayDate teacherSchedule={teacherSchedule} dateCalendar={dateCalendar}/>
                    </Grid>
                </CardBody>
                </>
            )}
        </Card>
    )
}