import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { ClassInfo } from './interface';
import { Box} from '@chakra-ui/react';
import TeacherSchedule from './teacherSchedule';
import MiniCalender from './miniCalendar';
import BigCalender from './bigCalendar';

// import { useBreakpointValue } from "@chakra-ui/react";
// const fontSize = useBreakpointValue({ base: "md", md: "lg", lg: "xl" });

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [teacherSchedule, setTeacherSchedule] = useState<ClassInfo[]>([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    axios.get<ClassInfo[]>('https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-5fbd0ad5-e0a9-488e-9b8d-b8ed9c78f6a1/default/skill-test-api/teacher/current-course')
      .then(response => {
        setTeacherSchedule(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); 
      });

      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };

  }, []); 


  return (
    <Box display={{base: "flex"}} flexDirection={{lg: "row" , base: "column"}} bg='#282c34' minH='100vh' width="100%" p={{lg: 5, md: 8, base: 5}} gap={5}>
      <Box display={{base: "flex"}} flexDirection={{lg: "column", sm: "row", base: "column"}} w={{base: "100%" , lg:"35%", xl: "30%"}} gap={5}>
        <TeacherSchedule teacherSchedule={teacherSchedule} loading={loading} screenWidth={screenWidth}/>
        <MiniCalender teacherSchedule={teacherSchedule} loading={loading}/>
      </Box>
      <Box w={{base: "100%", lg:"62%", xl: "70%"}}>
        <BigCalender teacherSchedule={teacherSchedule} loading={loading} screenWidth={screenWidth}/>
      </Box>
    </Box>
  );
}

export default App;
