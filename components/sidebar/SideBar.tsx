import React from 'react'
import SideBarContainer from './SideBarContainer'
import AccordingComponent from '../AccordingComponent'
import SideBarItems from './SideBarItem'
import { Building2, Calendar, SquareCheckBig, Stethoscope, User, UserPen } from 'lucide-react'

const Sidebar = () => {
    return (
        <div>
            <SideBarContainer>
                <div className="mt-4 w-full">
                    <AccordingComponent title="Registration" >
                        <SideBarItems link="/student" active={false} alert={true} icon={<User size={20} />} text="Student registration" />
                        <SideBarItems link="/teacher" active={false} alert={true} icon={<UserPen size={20} />} text="Teacher registration" />
                        <SideBarItems link="/doctor" active={false} alert={true} icon={<Stethoscope size={20} />} text="Doctor registration" />
                    </AccordingComponent>
                    <AccordingComponent title="Features" >
                        <SideBarItems link="/" active={false} alert={true} icon={<Calendar size={20} />} text="Event" />
                        <SideBarItems link="/" active={false} alert={true} icon={<SquareCheckBig size={20} />} text="Election" />
                        <SideBarItems link="/" active={false} alert={true} icon={<Building2 size={20} />} text="Facility" />
                    </AccordingComponent>
                    <SideBarItems link="/Department" active={false} alert={true} icon={<Building2 size={20} />} text="Departments" />
                </div>
            </SideBarContainer>
        </div>
    )
}

export default Sidebar