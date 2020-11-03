import FunctionNode_Runtime from "./FunctionNode_Runtime";
import "./ui/layaMaxUI"
import { ui } from "./ui/layaMaxUI";
import  Function_Line  from "./Function_Line";
export default class FunctionNodeSlot_Runtime extends ui.FunctionNodeSlot_ViewUI {
   
    m_Orientation:number=0;
    m_Param_Type:string;
    m_Param_Value:string;
    m_SlotType:string;
    m_SlotName:string;
    m_ID:string="";
    m_Node:FunctionNode_Runtime;
    m_Main_Page_Panel:Laya.Panel;

    m_Line_List:Map<string,Function_Line> =new Map<string,Function_Line>();
    constructor() { super(); 
    
        this.on(Laya.Event.MOUSE_DOWN,this,this.On_Mouse_Down);
    
    }
    
    Update_Slot()
    {
        debugger
        this.m_Slot_Name_Text.text=this.m_SlotName;
        if(this.m_Param_Type=="INT")
        {
            this.m_Slot_Type_Label.bgColor="#000FA0";
        }
    }

    On_Mouse_Down(e:Laya.Event)
    {   //console.log(e);
        

        e.stopPropagation();
        
        this.m_Main_Page_Panel.event("SLOT_CLICKED",[this.m_Node.m_ID, this.m_ID,this]);
    }

    onEnable(): void {
        this.Update_Slot();
    }

    onDisable(): void {
    }
}