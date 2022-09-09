/**
 * 表单-单(多)选组件
 * @author VenDream<suwenjun@szzbmy.com>
 * @since 2018-7-30
 */

import React, { Component } from 'react';


// import './choose.less';


interface ChooseProps {
  [key: string]: any;
}

interface ValueItem {
  id: string;
  value: string;
}

interface ChooseState {
  value: ValueItem[];
  activeIndex: number[];
}

export default class Choose extends Component<ChooseProps, ChooseState> {
  // 控件对应的表单数据内的 cmp ID
  formCmpId = '';

  // 根节点
  node: HTMLElement | null = null;

  constructor(props: ChooseProps) {
    super(props);
    this.state = {
      value: [],
      activeIndex: [],
    };
  }

  componentDidMount() {
    const {
      data: { formId, items, id },
      pageId,
    } = this.props;
    const formData = { pageId, node: this.node, items };

    // 初始化状态与数据
    this.formCmpId = `forms.${formId}.byIds.${id}`;
  }

  shouldComponentUpdate(nextProps: ChooseProps, nextState: ChooseState) {
    return nextState.activeIndex !== this.state.activeIndex;
  }

  componentWillUnmount() {
  }

  // 回显处理
  dataShow = (data: { value: any[] }) => {
    let values = data.value || [];
    const { items } = this.props.data;
    const { activeIndex } = this.state;
    if (!Array.isArray(values)) {
      values = JSON.parse(values);
    }

    const newActiveIndex = [...activeIndex];
    values.forEach(value => {
      const index = items.findIndex(item => item.value === value.id);
      if (index >= 0 && !newActiveIndex.includes(index)) {
        newActiveIndex.push(index);
      }
    });
    this.setState({
      activeIndex: newActiveIndex,
    });
  };

  // 格式化标题
  setLimitTitle = () => {
    const { data } = this.props;
    const {
      maxChecked = {
        count: 1,
        checked: false,
      },
      minChecked = {
        count: 1,
        checked: false,
      },
    } = data;
    const limitConf = [
      {
        type: !minChecked.checked && !maxChecked.checked,
        title: '多选',
      },
      {
        type: minChecked.checked && !maxChecked.checked,
        title: `最少选${minChecked.count}项`,
      },
      {
        type: !minChecked.checked && maxChecked.checked,
        title: `最多选${maxChecked.count}项`,
      },
      {
        type: minChecked.checked && maxChecked.checked && minChecked.count === maxChecked.count,
        title: `选${maxChecked.count}项`,
      },
      {
        type: minChecked.checked && maxChecked.checked && minChecked.count < maxChecked.count,
        title: `选${minChecked.count}~${maxChecked.count}项`,
      },
    ];
    const limitTitle = limitConf.find(o => o.type) || limitConf[0];
    return limitTitle.title;
  };

  // 渲染标题
  getTitle() {
    const { label, tips, multiple } = this.props.data;
    const title = tips ? tips.replace('（多选）', '') : label; // 兼容老作品默认带多选，防止出现多次多选的文案
    return (
      <div className="choose-title" style={this.props.style}>
        <span>{`${title}（${multiple ? this.setLimitTitle() : '单选'}）`}</span>
        {/* {required ? <span className="required-star">*</span> : null} */}
      </div>
    );
  }

  // 渲染选项
  getOptionList() {
    const { activeIndex } = this.state;
    const { style = {} } = this.props;
    const options = [] as JSX.Element[];
    const { items, multiple } = this.props.data;
    const btnCls = 'check-btn';

    items.forEach((item, i) => {
      const cls = 'choose-option'

      options.push(
        <li className={cls} style={style} key={i} onClick={() => this.handleChoose(i, item)}>
          <span className={btnCls} style={{ borderColor: style.color as string }}>
            <span
              className="dot"
              style={{
                borderColor: style.color as string,
                backgroundColor: style.color as string,
              }}
            />
          </span>
          <span className="option-label">{item.label}</span>
        </li>
      );
    });

    return (
      <ul style={this.props.style} className="choose-option-list">
        {options}
      </ul>
    );
  }

  handleChoose(index: number, val: any) {
    const { value, activeIndex } = this.state;
    const {
      required,
      multiple,
      maxChecked = {
        count: 1,
        checked: false,
      },
      minChecked = {
        count: 1,
        checked: false,
      },
    } = this.props.data;

    // 单选
    let newValue: ValueItem[] = new Array({
      id: val.value,
      value: val.label,
    });
    let newActiveIndex: number[] = [index];

    // 多选
    if (multiple) {
      // 之前已选中
      if (activeIndex.includes(index)) {
        newValue = value.filter(v => v.id !== val.value);
        newActiveIndex = activeIndex.filter(idx => idx !== index);
      } else {
        // 已激活选项综合大于用户设定的最大可选值，直接return
        if (maxChecked.checked && activeIndex.length >= maxChecked.count) return;
        // 之前没选中
        newValue = [
          ...value,
          {
            id: val.value,
            value: val.label,
          },
        ];
        newActiveIndex = [...activeIndex, index];
      }
    }

    // 更新状态
    this.setState({ value: newValue, activeIndex: newActiveIndex });

    // 更新数据
    const isValid =
      required &&
      (!newActiveIndex.length
        ? false
        : !(true && minChecked.checked && newActiveIndex.length < minChecked.count));
    let tips = '';
    if (!isValid && !newActiveIndex.length) {
      tips = `有必填${multiple ? '多' : '单'}项选择未填写，请检查`;
    } else if (!isValid && minChecked.checked && newActiveIndex.length < minChecked.count) {
      tips = `多项选择最少选${minChecked.count}项`;
    }
    const updateData = {
      value: newValue,
      isValid: !required ? true : isValid,
      tips,
      // 废弃的值
      deprecatedValue: newValue.map(val => val.value),
    };
  }

  render() {
    return (
      <div className="choose-wrapper" style={this.props.style} ref={node => (this.node = node)}>
        {/* {this.getTitle()} */}
        {this.getOptionList()}
      </div>
    );
  }
}
