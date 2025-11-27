import AsyncStorage from "@react-native-async-storage/async-storage";
    
export const storeData=(key,value)=>{
    AsyncStorage.setItem(key,value)
}

export const retriveData=async(key)=>{
    const data= await AsyncStorage.getItem(key)
    return data;
}

export const removeData=async(key)=>{
    const data=await AsyncStorage.removeItem(key)
    return data;
}