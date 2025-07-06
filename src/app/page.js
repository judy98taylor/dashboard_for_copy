'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [copiedItems, setCopiedItems] = useState({});

  // 通用的复制处理函数
  const handleCopy = (text, elementId, prefix = '') => {
    let textToCopy = text;

    if (elementId.includes('category')) {
      // 如果是产品类别，用/分割文本，只复制最后一个
      const parts = text.split('/');
      textToCopy = parts[parts.length - 1].trim();
    }

    // 添加前缀（如果有）
    textToCopy = prefix + textToCopy;

    // 复制文本
    navigator.clipboard.writeText(textToCopy);
    
    // 更新复制状态
    setCopiedItems(prev => ({
      ...prev,
      [elementId]: true
    }));

    // 1秒后清除复制状态
    setTimeout(() => {
      setCopiedItems(prev => ({
        ...prev,
        [elementId]: false
      }));
    }, 1000);
  };

  const [selectedTab, setSelectedTab] = useState(null);
  const [productData, setProductData] = useState(null);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    // 获取产品列表
    async function fetchProductList() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProductList(data);
        if (data.length > 0) {
          setSelectedTab(data[0]);
        }
      } catch (error) {
        console.error('Error fetching product list:', error);
      }
    }
    fetchProductList();
  }, []);

  useEffect(() => {
    // 获取选中产品的详细信息
    async function fetchProductData() {
      if (selectedTab) {
        try {
          const response = await fetch(`/api/products/${selectedTab}`);
          const data = await response.json();
          setProductData(data);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
    }
    fetchProductData();
  }, [selectedTab]);

  return (
    <div className="flex h-screen">
      {/* aside 产品列表tabs */}
      <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">产品列表</h2>
        <div className="space-y-2">
          {productList.map((productId,index) => (
            <button
              key={productId}
              className={`w-full text-left px-4 py-1 rounded ${selectedTab === productId ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'} ${copiedItems[`tab-${productId}`] ? 'text-blue-500' : ''}`}
                onClick={() => {
                  setSelectedTab(productId);
                  // handleCopy(productId, `tab-${productId}`);
                }}
                id={`tab-${productId}`}
            >
              {index+1}_{productId}
            </button>
          ))}
        </div>
      </div>

      {/* main产品信息 */}
      <div className="flex-1 p-8 overflow-y-auto">
        {productData ? (
          <div className="space-y-6">
            {/* 通用信息 */}
            <div style={{
              display: 'flex',
              gap: '10px',
            }}>
              <p 
                id="sku"
                className={`cursor-pointer hover:text-blue-500 ${copiedItems['sku'] ? 'text-blue-500' : ''}`}
                onClick={() => handleCopy(productData.productId, 'sku', 'SD')}
              >
                <span className="font-semibold">SKU:</span> SD{productData.productId}
                {copiedItems['sku'] && <span className="text-green-500">(已复制)</span>}
              </p>
              {/* <p 
                id="price"
                className={`cursor-pointer hover:text-blue-500 ${copiedItems['price'] ? 'text-blue-500' : ''}`}
                onClick={() => handleCopy('500', 'price')}
              >
                <span className="font-semibold">price:</span> 500
                {copiedItems['price'] && <span className="text-green-500">(已复制)</span>}
              </p> */}
              {/* <p 
                id="sell-price"
                className={`cursor-pointer hover:text-blue-500 ${copiedItems['sell-price'] ? 'text-blue-500' : ''}`}
                onClick={() => handleCopy('400', 'sell-price')}
              >
                <span className="font-semibold">sell-price:</span> 400
                {copiedItems['sell-price'] && <span className="text-green-500">(已复制)</span>}
              </p> */}
              {/* <p 
                id="stock"
                className={`cursor-pointer hover:text-blue-500 ${copiedItems['stock'] ? 'text-blue-500' : ''}`}
                onClick={() => handleCopy('50', 'stock')}
              >
                <span className="font-semibold">stock:</span> 50
                {copiedItems['stock'] && <span className="text-green-500">(已复制)</span>}
              </p> */}
              <p 
                id="productId"
                className={`cursor-pointer hover:text-blue-500 ${copiedItems['productId'] ? 'text-blue-500' : ''}`}
                onClick={() => handleCopy(productData.productId, 'productId')}
              >
                <span className="font-semibold">productId:</span> {productData.productId}
                {copiedItems['productId'] && <span className="text-green-500">(已复制)</span>}
              </p>

            </div>
            <div className="grid grid-cols-2 gap-8">
              {/* 左侧英文信息 */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <p 
                    id="category-en"
                    className={`cursor-pointer hover:text-blue-500 category ${copiedItems['category-en'] ? 'text-blue-500' : ''}`}
                    onClick={() => handleCopy(productData.categoryPath_1_en, 'category-en')}
                  >
                    <span className="font-semibold">Category:</span> {productData.categoryPath_1_en}
                    {copiedItems['category-en'] && <span className="text-green-500">(已复制)</span>}
                  </p>
                  <p 
                    id="brand-en"
                    className={`cursor-pointer hover:text-blue-500 ${copiedItems['brand-en'] ? 'text-blue-500' : ''}`}
                    onClick={() => handleCopy(productData.productBrand_1_en, 'brand-en')}
                  >
                    <span className="font-semibold">Brand:</span> {productData.productBrand_1_en}
                    {copiedItems['brand-en'] && <span className="text-green-500">(已复制)</span>}
                  </p>
                  <p 
                    id="product-name-en"
                    className={`cursor-pointer hover:text-blue-500 ${copiedItems['product-name-en'] ? 'text-blue-500' : ''}`}
                    onClick={() => handleCopy(productData.productName_1_en, 'product-name-en')}
                  >
                    <span className="font-semibold">Product Name:</span> {productData.productName_1_en}
                    {copiedItems['product-name-en'] && <span className="text-green-500">(已复制)</span>}
                  </p>
                  <p 
                    id="short-desc-en"
                    className={`cursor-pointer hover:text-blue-500 ${copiedItems['short-desc-en'] ? 'text-blue-500' : ''}`}
                    onClick={() => handleCopy(productData.shortDesc_1_en, 'short-desc-en')}
                  >
                    <span className="font-semibold">Short Description:</span> {productData.shortDesc_1_en}
                    {copiedItems['short-desc-en'] && <span className="text-green-500">(已复制)</span>}
                  </p>
                  <p 
                    id="origin-en"
                    className={`cursor-pointer hover:text-blue-500 ${copiedItems['origin-en'] ? 'text-blue-500' : ''}`}
                    onClick={() => handleCopy(productData.origin_1_en, 'origin-en')}
                  >
                    <span className="font-semibold">Origin:</span> {productData.origin_1_en}
                    {copiedItems['origin-en'] && <span className="text-green-500">(已复制)</span>}
                  </p>
                </div>
              </div>
              {/* 右侧中文信息 */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <p 
                    id="category-cn"
                    className={`cursor-pointer hover:text-blue-500 category ${copiedItems['category-cn'] ? 'text-blue-500' : ''}`}
                    onClick={() => handleCopy(productData.categoryPath_2_cn, 'category-cn')}
                  >
                    <span className="font-semibold">类别：</span>{productData.categoryPath_2_cn}
                    {copiedItems['category-cn'] && <span className="text-green-500">(已复制)</span>}
                  </p>
                  <p 
                    id="brand-cn"
                    className={`cursor-pointer hover:text-blue-500 ${copiedItems['brand-cn'] ? 'text-blue-500' : ''}`}
                    onClick={() => handleCopy(productData.productBrand_2_cn, 'brand-cn')}
                  >
                    <span className="font-semibold">品牌：</span>{productData.productBrand_2_cn}
                    {copiedItems['brand-cn'] && <span className="text-green-500">(已复制)</span>}
                  </p>
                  <p 
                    id="product-name-cn"
                    className={`cursor-pointer hover:text-blue-500 ${copiedItems['product-name-cn'] ? 'text-blue-500' : ''}`}
                    onClick={() => handleCopy(productData.productName_2_cn, 'product-name-cn')}
                  >
                    <span className="font-semibold">产品名称：</span>{productData.productName_2_cn}
                    {copiedItems['product-name-cn'] && <span className="text-green-500">(已复制)</span>}
                  </p>
                  <p 
                    id="short-desc-cn"
                    className={`cursor-pointer hover:text-blue-500 ${copiedItems['short-desc-cn'] ? 'text-blue-500' : ''}`}
                    onClick={() => handleCopy(productData.shortDesc_2_cn, 'short-desc-cn')}
                  >
                    <span className="font-semibold">产品描述：</span>{productData.shortDesc_2_cn}
                    {copiedItems['short-desc-cn'] && <span className="text-green-500">(已复制)</span>}
                  </p>
                  <p 
                    id="origin-cn"
                    className={`cursor-pointer hover:text-blue-500 ${copiedItems['origin-cn'] ? 'text-blue-500' : ''}`}
                    onClick={() => handleCopy(productData.origin_2_cn, 'origin-cn')}
                  >
                    <span className="font-semibold">产地：</span>{productData.origin_2_cn}
                    {copiedItems['origin-cn'] && <span className="text-green-500">(已复制)</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">请选择一个产品查看详细信息</p>
          </div>
        )}
      </div>
    </div>
  );
}
