
import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions, Picker, Platform } from 'react-native';

const screen = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#07121B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderWidth: 10,
        borderColor: '#89AAFF',
        width: screen.width / 2,
        height: screen.width / 2,
        borderRadius: screen.width / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    buttonText: {
        fontSize: 35,
        color: '#89AAFF',
    },
    timer: {
        color: '#fff',
        fontSize: 90,
    },
    buttonStop: {
        borderColor: '#FF851B'
    },
    buttonTextStop: {
        color: '#FF851B'
    },
    picker: {
        width: 50,
        ...Platform.select({
            android: {
                color: '#fff',
                backgroundColor: '#07121B',
                marginLeft: 10,
            }
        })

    },
    pickerItem: {
        color: '#fff',
        fontSize: 20
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    }

});

const formatNumber = (num) => `0${num}`.slice(-2);

const getRemainingTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
}

const createArray = length => {
    const arr = [];
    let i = 0;
    while (i < length) {
        arr.push(i.toString());
        i += 1;
    }
    return arr;
}
const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);


export default class App extends React.Component {

    state = {
        remainingSeconds: 5,
        isrunnung: false,
        selectedMinutes: "0",
        selectedSeconds: "5",

    }
    interval = null;

    componentWillUpdate(prevProp, prevState) {
        if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
            this.stop();
        }
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    start = () => {
        this.setState(state => ({
            remainingSeconds:
                parseInt(state.selectedMinutes, 10) * 60 +
                parseInt(state.selectedSeconds, 10),
            isrunnung: true
        }));


        this.interval = setInterval(() => {
            this.setState(state => ({
                remainingSeconds: state.remainingSeconds - 1
            }))
        }, 1000);
    }
    stop = () => {
        clearInterval(this.interval);
        this.interval = null;
        this.setState({ remainingSeconds: 5, isRunning: false })

    }
    renderPickers = () => (

        <View style={styles.pickerContainer}>
            <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={this.state.selectedMinutes}
                onValueChange={itemValue => {
                    this.setState({ selectedMinutes: itemValue })
                }}
                mode="dropdown"
            >
                {AVAILABLE_MINUTES.map(value => (
                    <Picker.Item key={value} label={value} value={value} />
                ))}

            </Picker>

            <Text style={styles.pickerItem}>minutes</Text>
            <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={this.state.selectedSeconds}
                onValueChange={itemValue => {
                    this.setState({ selectedSeconds: itemValue })
                }}
                mode="dropdown"
            >
                {
                    AVAILABLE_SECONDS.map(val => (
                        <Picker.Item key={val} label={val} value={val} />
                    ))
                }

            </Picker>
            <Text style={styles.pickerItem}>seconds</Text>
        </View>

    )

    render() {
        const { minutes, seconds } = getRemainingTime(this.state.remainingSeconds);
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                {this.state.isrunnung ? (

                    <Text style={styles.timer}>{`${minutes}:${seconds}`}</Text>
                ) :(
                     this.renderPickers()
                )}
                    
                {this.state.isrunnung ? (

                    <TouchableOpacity style={[styles.button, styles.buttonStop]} onPress={this.stop}>
                        <Text style={[styles.buttonText, styles.buttonTextStop]}>STOP</Text>
                    </TouchableOpacity>
                ) : (

                        <TouchableOpacity style={styles.button} onPress={this.start}>
                            <Text style={styles.buttonText}>START</Text>
                        </TouchableOpacity>
                    )}

            </View>
        );
    }

}

