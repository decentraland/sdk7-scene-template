import { ui } from './ui'
import {createCube} from "./cube";
import {createUITransform} from "./uiTransform";
import {createUIText} from "./uiText";

createCube(8,1,8)
// createUITransform(100,100)
// createUITransform(100,100, 513)
// createUITransform(100,100, 513)
// createUITransform(100,100, 513)
//
// createUIText('test',100,100,513)
// createUIText('test2',100,100,513)


engine.renderUI(ui())
