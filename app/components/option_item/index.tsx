// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useMemo} from 'react';
import {Platform, StyleProp, Switch, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';

import CompassIcon from '@components/compass_icon';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import RadioItem, {RadioItemProps} from './radio_item';

const OptionType = {
    ARROW: 'arrow',
    DEFAULT: 'default',
    NONE: 'none',
    RADIO: 'radio',
    SELECT: 'select',
    TOGGLE: 'toggle',
} as const;

type OptionType = typeof OptionType[keyof typeof OptionType];

export const ITEM_HEIGHT = 48;

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        actionContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 16,
        },
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: ITEM_HEIGHT,
        },
        destructive: {
            color: theme.dndIndicator,
        },
        description: {
            color: changeOpacity(theme.centerChannelColor, 0.64),
            ...typography('Body', 75),
            marginTop: 2,
        },
        iconContainer: {marginRight: 16},
        infoContainer: {marginRight: 2},
        info: {
            color: changeOpacity(theme.centerChannelColor, 0.56),
            ...typography('Body', 100),
        },
        inlineLabel: {
            flexDirection: 'row',
            flexShrink: 1,
            justifyContent: 'center',
        },
        inlineLabelText: {
            color: theme.centerChannelColor,
            ...typography('Body', 200, 'SemiBold'),
        },
        inlineDescription: {
            color: theme.centerChannelColor,
            ...typography('Body', 200),
        },
        label: {
            flexShrink: 1,
            justifyContent: 'center',
        },
        labelContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        labelText: {
            color: theme.centerChannelColor,
            ...typography('Body', 200),
        },
        row: {
            flex: 1,
            flexDirection: 'row',
        },
    };
});

export type OptionItemProps = {
    action?: (React.Dispatch<React.SetStateAction<string | boolean>>)|((value: string | boolean) => void);
    containerStyle?: StyleProp<ViewStyle>;
    description?: string;
    destructive?: boolean;
    icon?: string;
    info?: string;
    inline?: boolean;
    label: string;
    optionDescriptionTextStyle?: StyleProp<TextStyle>;
    optionLabelTextStyle?: StyleProp<TextStyle>;
    radioItemProps?: Partial<RadioItemProps>;
    selected?: boolean;
    testID?: string;
    type: OptionType;
    value?: string;
}
const OptionItem = ({
    action,
    containerStyle,
    description,
    destructive,
    icon,
    info,
    inline = false,
    label,
    optionDescriptionTextStyle,
    optionLabelTextStyle,
    radioItemProps,
    selected,
    testID = 'optionItem',
    type,
    value,
}: OptionItemProps) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const isInLine = inline && Boolean(description);

    const labelStyle = useMemo(() => {
        return isInLine ? styles.inlineLabel : styles.label;
    }, [inline, styles, isInLine]);

    const labelTextStyle = useMemo(() => {
        return [
            isInLine ? styles.inlineLabelText : styles.labelText,
            destructive && styles.destructive,
        ];
    }, [destructive, styles, isInLine]);

    const descriptionTextStyle = useMemo(() => {
        return [
            isInLine ? styles.inlineDescription : styles.description,
            destructive && styles.destructive,
        ];
    }, [destructive, styles, isInLine]);

    let actionComponent;
    let radioComponent;
    if (type === OptionType.SELECT && selected) {
        actionComponent = (
            <CompassIcon
                color={theme.linkColor}
                name='check'
                size={24}
                testID={`${testID}.selected`}
            />
        );
    } else if (type === OptionType.RADIO) {
        radioComponent = (
            <RadioItem
                selected={Boolean(selected)}
                {...radioItemProps}
            />
        );
    } else if (type === OptionType.TOGGLE) {
        const trackColor = Platform.select({
            ios: {true: theme.buttonBg, false: changeOpacity(theme.centerChannelColor, 0.16)},
            default: {true: changeOpacity(theme.buttonBg, 0.32), false: changeOpacity(theme.centerChannelColor, 0.24)},
        });
        const thumbColor = Platform.select({
            android: selected ? theme.buttonBg : '#F3F3F3', // Hardcoded color specified in ticket MM-45143
        });
        actionComponent = (
            <Switch
                onValueChange={action}
                value={selected}
                trackColor={trackColor}
                thumbColor={thumbColor}
                testID={`${testID}.toggled.${selected}`}
            />
        );
    } else if (type === OptionType.ARROW) {
        actionComponent = (
            <CompassIcon
                color={changeOpacity(theme.centerChannelColor, 0.32)}
                name='chevron-right'
                size={24}
            />
        );
    }

    const onPress = useCallback(() => {
        action?.(value || '');
    }, [value, action]);

    const component = (
        <View
            testID={testID}
            style={[styles.container, containerStyle]}
        >
            <View style={styles.row}>
                <View style={styles.labelContainer}>
                    {Boolean(icon) && (
                        <View style={styles.iconContainer}>
                            <CompassIcon
                                name={icon!}
                                size={24}
                                color={destructive ? theme.dndIndicator : changeOpacity(theme.centerChannelColor, 0.64)}
                            />
                        </View>
                    )}
                    {type === OptionType.RADIO && radioComponent}
                    <View style={labelStyle}>
                        <Text
                            style={[optionLabelTextStyle, labelTextStyle]}
                            testID={`${testID}.label`}
                        >
                            {label}
                        </Text>
                        {Boolean(description) &&
                        <Text
                            style={[optionDescriptionTextStyle, descriptionTextStyle]}
                            testID={`${testID}.description`}
                        >
                            {description}
                        </Text>
                        }
                    </View>
                </View>
            </View>
            {Boolean(actionComponent || info) &&
            <View style={styles.actionContainer}>
                {
                    Boolean(info) &&
                    <View style={styles.infoContainer}>
                        <Text style={[styles.info, destructive && {color: theme.dndIndicator}]}>{info}</Text>
                    </View>
                }
                {actionComponent}
            </View>
            }
        </View>
    );

    if (type === OptionType.DEFAULT || type === OptionType.SELECT || type === OptionType.ARROW || type === OptionType.RADIO) {
        return (
            <TouchableOpacity onPress={onPress}>
                {component}
            </TouchableOpacity>
        );
    }

    return component;
};

export default OptionItem;