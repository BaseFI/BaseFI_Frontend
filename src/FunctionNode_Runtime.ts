import FunctionNodeSlot_Runtime from "./FunctionNodeSlot_Runtime";
import {ui} from "./ui/layaMaxUI"
export default class FunctionNode_Runtime extends ui.FunctionNode_ViewUI {
  
    m_Main_Page_Panel:Laya.Panel;
    m_Mouse_Down:boolean =false;
    m_ID:string="";
    m_Clicked_Callback:Function;
    m_Old_Mouse_Point_X:number=0;
    m_Old_Mouse_Point_Y:number=0;
    m_Name:string;
    m_Slot_List:Map<string,FunctionNodeSlot_Runtime> =new Map<string,FunctionNodeSlot_Runtime>();

    constructor() { super(); 
    
    }
    SetNodeName(name:string)
    {
        this.m_Name=name;
        this.m_Node_Name_Label.text=name;
    }
    Add_Slot(id:string, p_width:number,p_heigth:number,p_left:number,p_top:number,p_orientation:number):void
    {
        let slot:FunctionNodeSlot_Runtime =new FunctionNodeSlot_Runtime();
        slot.m_Node=this;
        slot.m_ID=id;

        slot.width=p_width;
        slot.height=p_heigth;
        slot.m_Orientation=p_orientation;
        
        slot.top=p_top;
        slot.left=p_left;
        slot.m_Main_Page_Panel=this.m_Main_Page_Panel;
        this.addChild(slot);
        this.m_Slot_List.set(id,slot);
    }
    Update_Node()
    {
        this.m_Node_Background.width=this.width;
        this.m_Node_Background.height=this.height;
        this.repaint();
    }
    onEnable(): void {

   
        this.Update_Node();
        this.on(Laya.Event.MOUSE_DOWN,this,this.On_Mouse_Down);
        this.on(Laya.Event.MOUSE_UP,this,this.On_Mouse_Up);
        this.on(Laya.Event.MOUSE_MOVE,this,this.On_Mouse_Move);
        this.on(Laya.Event.MOUSE_OVER,this,this.On_Mouse_Over);
        this.on(Laya.Event.MOUSE_OUT,this,this.On_Mouse_Out);
    }
    On_Mouse_Over(e:Laya.Event)
    {
        this.zOrder=5;
    }
    On_Mouse_Out(e:Laya.Event)
    {
        this.zOrder=4;
    }
    

    On_Mouse_Down(e:Laya.Event)
    {   //console.log(e);
        
        //console.log("MOUSE");
        let x:number=this.mouseX;
        let y:number=this.mouseY;
        console.log(x+"-"+y)
        this.m_Old_Mouse_Point_X=x;
        this.m_Old_Mouse_Point_Y=y;
        this.m_Mouse_Down=true;
        this.captureMouseEvent(false);
        this.m_Clicked_Callback();
        e.stopPropagation();
        this.m_Main_Page_Panel.event("NODE_CLICKED",[this.m_ID,this]);
    }
    On_Mouse_Up(e:Laya.Event)
    {   //console.log(e);

        this.m_Mouse_Down=false;
        this.releaseMouseEvent();
        e.stopPropagation();
    }
    On_Mouse_Move(e:Laya.Event)
    {   //console.log(e);
        //console.log("MOUSE");
        let x:number=this.mouseX;
        let y:number=this.mouseY;
        //console.log(x+"-"+y)
        if(this.m_Mouse_Down===true)
        {

            let delta_x:number=0;
            let delta_y:number=0;
            delta_x=x-this.m_Old_Mouse_Point_X;
            delta_y=y-this.m_Old_Mouse_Point_Y;
            this.left+=delta_x;
            this.top +=delta_y;
            this.m_Main_Page_Panel.event("MAIN_PAGE_REPAINT_LINE");
        }
        e.stopPropagation();
    }
    onDisable(): void {
    }
}