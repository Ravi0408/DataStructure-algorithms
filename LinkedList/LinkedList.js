class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  prepend(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
  }

  pop() {
    if (!this.head) {
      return null;
    }
    let current = this.head;
    let previous = null;
    while (current.next) {
      previous = current;
      current = current.next;
    }
    if (previous) {
      previous.next = null;
      this.tail = previous;
    } else {
      this.head = null;
      this.tail = null;
    }
    this.length--;
    return current.value;
  }
  shift() {
    if (!this.head) {
      return null;
    }
    const value = this.head.value;
    this.head = this.head.next;
    this.length--;
    return value;
  }
  get(index) {
    if (index < 0 || index >= this.length) {
      return null;
    }
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current.value;
  }
  set(index, value) {
    if (index < 0 || index >= this.length) {
      return false;
    }
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    current.value = value;
    return true;
  }
  insert(index, value) {
    if (index < 0 || index > this.length) {
      return false;
    }
    const newNode = new Node(value);
    if (index === 0) {
      newNode.next = this.head;
      this.head = newNode;
      if (!this.tail) {
        this.tail = newNode;
      }
    } else {
      let current = this.head;
      for (let i = 0; i < index - 1; i++) {
        current = current.next;
      }
      newNode.next = current.next;
      current.next = newNode;
      if (!newNode.next) {
        this.tail = newNode;
      }
    }
    this.length++;
    return true;
  }
  remove(index) {
    if (index < 0 || index >= this.length) {
      return false;
    }
    if (index === 0) {
      this.head = this.head.next;
      if (!this.head) {
        this.tail = null;
      }
    } else {
      let current = this.head;
      for (let i = 0; i < index - 1; i++) {
        current = current.next;
      }
      current.next = current.next ? current.next.next : null;
      if (!current.next) {
        this.tail = current;
      }
    }
    this.length--;
    return true;
  }
  reverse() {
    let current = this.head;
    let previous = null;
    this.tail = this.head;
    while (current) {
      const next = current.next;
      current.next = previous;
      previous = current;
      current = next;
    }
    this.head = previous;
  }
    display() {
        const values = [];
        let current = this.head;
        while (current) {
        values.push(current.value);
        current = current.next;
        }
        return values;
    }
    find(value) {
        let current = this.head;
        while (current) {
            if (current.value === value) {
                return current;
            }
            current = current.next;
        }
        return null;
    }
    clear() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    isEmpty() {
        return this.length === 0;
    }
    size() {
        return this.length;
    }
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }
    fromArray(array) {
        this.clear();
        array.forEach(value => this.append(value));
    }
    sort(compareFn) {
        if (this.length <= 1) {
            return;
        }
        let swapped;
        do {
            swapped = false;
            let current = this.head;
            while (current && current.next) {
                if (compareFn(current.value, current.next.value) > 0) {
                    const temp = current.value;
                    current.value = current.next.value;
                    current.next.value = temp;
                    swapped = true;
                }
                current = current.next;
            }
        } while (swapped);
    }
    merge(otherList) {
        if (!otherList.head) {
            return;
        }
        if (!this.head) {
            this.head = otherList.head;
            this.tail = otherList.tail;
        } else {
            this.tail.next = otherList.head;
            this.tail = otherList.tail;
        }
        this.length += otherList.length;
    }
    split() {
        if (!this.head || this.length < 2) {
            return null;
        }
        const midIndex = Math.floor(this.length / 2);
        let current = this.head;
        for (let i = 0; i < midIndex - 1; i++) {
            current = current.next;
        }
        const newList = new LinkedList();
        newList.head = current.next;
        newList.tail = this.tail;
        current.next = null;
        this.tail = current;
        this.length = midIndex;
        return newList;
    }
    clone() {
        const newList = new LinkedList();
        let current = this.head;
        while (current) {
            newList.append(current.value);
            current = current.next;
        }
        return newList;
    }
    findMiddle() {
        if (!this.head) {
            return null;
        }
        let slow = this.head;
        let fast = this.head;
        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow.value;
    }
    hasCycle() {
        if (!this.head) {
            return false;
        }
        let slow = this.head;
        let fast = this.head;
        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow === fast) {
                return true;
            }
        }
        return false;
    }
    detectCycle() {
        if (!this.head) {
            return null;
        }
        let slow = this.head;
        let fast = this.head;
        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow === fast) {
                let entry = this.head;
                while (entry !== slow) {
                    entry = entry.next;
                    slow = slow.next;
                }
                return entry.value;
            }
        }
        return null;
    }
    removeDuplicates() {
        if (!this.head) {
            return;
        }
        const seen = new Set();
        let current = this.head;
        seen.add(current.value);
        while (current.next) {
            if (seen.has(current.next.value)) {
                current.next = current.next.next;
                this.length--;
            } else {
                seen.add(current.next.value);
                current = current.next;
            }
        }
        this.tail = current;
    }
    kthFromEnd(k) {
        if (k < 0 || k >= this.length) {
            return null;
        }
        let current = this.head;
        let target = this.head;
        for (let i = 0; i < k; i++) {
            current = current.next;
        }
        while (current) {
            current = current.next;
            target = target.next;
        }
        return target.value;
    }
    rotate(k) {
        if (k < 0 || k >= this.length) {
            return;
        }
        let current = this.head;
        for (let i = 0; i < k; i++) {
            current = current.next;
        }
        const newHead = current.next;
        current.next = null;
        this.tail.next = this.head;
        this.head = newHead;
        this.tail = current;
    }
    removeValue(value) {
        if (!this.head) {
            return false;
        }
        if (this.head.value === value) {
            this.head = this.head.next;
            this.length--;
            return true;
        }
        let current = this.head;
        while (current.next) {
            if (current.next.value === value) {
                current.next = current.next.next;
                this.length--;
                return true;
            }
            current = current.next;
        }
        return false;
    }
    findNthFromEnd(n) {
        if (n < 0 || n >= this.length) {
            return null;
        }
        let current = this.head;
        let target = this.head;
        for (let i = 0; i < n; i++) {
            current = current.next;
        }
        while (current) {
            current = current.next;
            target = target.next;
        }
        return target.value;
    }
    findIntersection(otherList) {
        if (!this.head || !otherList.head) {
            return null;
        }
        let currentA = this.head;
        let currentB = otherList.head;
        while (currentA !== currentB) {
            currentA = currentA ? currentA.next : otherList.head;
            currentB = currentB ? currentB.next : this.head;
        }
        return currentA ? currentA.value : null;
    }
    findMiddleElement() {
        if (!this.head) {
            return null;
        }
        let slow = this.head;
        let fast = this.head;
        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow.value;
    }
    findNthFromStart(n) {
        if (n < 0 || n >= this.length) {
            return null;
        }
        let current = this.head;
        for (let i = 0; i < n; i++) {
            current = current.next;
        }
        return current.value;
    }
}


// Example usage
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.prepend(0);
list.pop();
list.shift();
console.log(list.get(1)); // 2
console.log(list.set(1, 4)); // true
console.log(list.get(1)); // 4
list.insert(1, 3);
console.log(list.get(1)); // 3
list.remove(1);
console.log(list.get(1)); // 4
list.reverse();
console.log(list.display()); // [4]
list.display(); // [4]
list.append(5);
list.append(6);
list.append(7);
console.log(list.display()); // [4, 5, 6, 7]
list.clear();
list.append(8);
list.append(9);
console.log(list.display()); // [8, 9]
list.append(10);
list.append(11);
console.log(list.display()); // [8, 9, 10, 11]
list.removeDuplicates();
list.append(10);
list.append(11);
console.log(list.display()); // [8, 9, 10, 11]
list.removeDuplicates();
console.log(list.display()); // [8, 9, 10, 11]
list.rotate(2);
console.log(list.display()); // [10, 11, 8, 9]
list.removeValue(10);
console.log(list.display()); // [11, 8, 9]
list.removeValue(8);
console.log(list.display()); // [11, 9]
list.removeValue(11);
console.log(list.display()); // [9]
list.removeValue(9);
console.log(list.display()); // []
list.append(12);
list.append(13);
list.append(14);
list.append(15);
list.append(16);
list.append(17);
console.log(list.display()); // [12, 13, 14, 15, 16, 17]
