
import {
    Text,
    TouchableOpacity
} from "react-native";


interface Props{
title:string;
onPress:()=>void;
}


export default function AnswerButton({
title,
onPress
}:Props){

return (

<TouchableOpacity
onPress={onPress}
>

<Text>
{title}
</Text>

</TouchableOpacity>

);

}