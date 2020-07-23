import { default as React, useState, useCallback } from 'react';
import { default as classnames } from 'classnames';
import { useEffect } from 'react';
import { useRef } from 'react';
import { ArrowIcon } from '../icons';
import { apiConfig } from '../../config';

const ImageGallery = ({ images }) => {
    const [selectedImgUrl, setSelectedImgUrl] = useState();
    const [isOverflowing, setIsOverflowing] = useState();
    const [rightEnd, setRightEnd] = useState(false);
    const [leftEnd, setLeftEnd] = useState(false);
    const [fixedImages, setFixedImages] = useState(false);
    const thumbnailContainer = useRef(null);
    const scrollDistance = 400;

    useEffect(() => {
        const fixed = images.map(imageUrl => {
            return imageUrl.startsWith('uploads/') ? `${apiConfig.baseURL}/${imageUrl}` : imageUrl;
        });
        setFixedImages(fixed);
        fixed && setSelectedImgUrl(fixed[0]);
    }, [images])


    useEffect(() => {
        checkLeftEnd();
        checkRightEnd();
    }, [thumbnailContainer]);

    const updateOverflow = useCallback(() => {
        const overflow = thumbnailContainer.current.scrollWidth > thumbnailContainer.current.clientWidth;
        setIsOverflowing(overflow);
        checkLeftEnd();
        checkRightEnd();
    }, [thumbnailContainer])

    const checkRightEnd = (inAdvance) => {
        const scrollRight = thumbnailContainer && (thumbnailContainer.current.scrollLeft + thumbnailContainer.current.clientWidth);
        const nextScrollRight = scrollRight + scrollDistance;
        const scrollWidth = thumbnailContainer && thumbnailContainer.current.scrollWidth;
        if (inAdvance) return setRightEnd(nextScrollRight >= scrollWidth);
        setRightEnd(scrollRight >= scrollWidth);
    }

    const checkLeftEnd = (inAdvance) => {
        const scrollLeft = thumbnailContainer.current.scrollLeft;
        const nextScrollLeft = thumbnailContainer.current.scrollLeft - scrollDistance;
        if (inAdvance) return setLeftEnd(nextScrollLeft <= 0);
        setLeftEnd(scrollLeft <= 0);
    }

    const thumbnailClickHandler = (imageUrl) => {
        setSelectedImgUrl(imageUrl);
    }

    const rightClickHandler = (e) => {
        thumbnailContainer && thumbnailContainer.current.scrollBy({left: scrollDistance, behavior: 'smooth'});
        checkRightEnd(true);
        setLeftEnd(false);
    }

    const leftClickHandler = (e) => {
        thumbnailContainer && thumbnailContainer.current.scrollBy({left: -scrollDistance, behavior: 'smooth'});
        checkLeftEnd(true);
        setRightEnd(false);
    }

    return (
    <div className="imageGallery">
        <div className="imageGallery__selected">
            <img className="imageGallery__selectedImg" src={selectedImgUrl} alt="Selected" />
        </div>
        <div className="imageGallery__navigator" >
            <div className="imageGallery__thumbnails" ref={thumbnailContainer}>
                {fixedImages && fixedImages.map((imageUrl) => (
                    <div key={imageUrl} className={classnames('imageGallery__thumbnail', (imageUrl === selectedImgUrl) && 'imageGallery__thumbnail--selected')}>
                        <img className="imageGallery__thumbnailImg" src={imageUrl} onClick={() => thumbnailClickHandler(imageUrl)} alt="Thumbnail" onLoad={updateOverflow} />
                    </div>
                ))}
            </div>
            {isOverflowing && !leftEnd && (
                <div className="imageGallery__navigatorLeft" onClick={leftClickHandler}>
                    <ArrowIcon color="#ff6c31" classes="icon--turn180" />
                </div>
            )}
            {isOverflowing && !rightEnd && (
                <div className="imageGallery__navigatorRight" onClick={rightClickHandler}>
                    <ArrowIcon color="#ff6c31" />
                </div>
            )}
        </div>
    </div>
    );
};

export default ImageGallery;
